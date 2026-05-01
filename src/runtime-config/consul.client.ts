import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface KVResult<T> {
  value: T;
  index: string;
}

export interface GetKVOptions {
  index?: string;
  wait?: string;
  signal?: AbortSignal;
}

@Injectable()
export class ConsulClient {
  private readonly logger = new Logger(ConsulClient.name);
  private readonly http: AxiosInstance;
  private readonly defaultWait: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('CONSUL_HOST', 'localhost');
    const port = config.get<string>('CONSUL_PORT', '8500');
    const token = config.get<string>('CONSUL_TOKEN');
    this.defaultWait = config.get<string>('CONSUL_BLOCKING_WAIT', '5m');

    this.http = axios.create({
      baseURL: `http://${host}:${port}`,
      timeout: this.parseWaitMs(this.defaultWait) + 60_000,
      headers: token ? { 'X-Consul-Token': token } : {},
    });
  }

  async getKV<T>(key: string, opts: GetKVOptions = {}): Promise<KVResult<T>> {
    const params: Record<string, string> = {};
    if (opts.index !== undefined) {
      params.index = opts.index;
      params.wait = opts.wait ?? this.defaultWait;
    }

    const res = await this.http.get(`/v1/kv/${key}`, {
      params,
      signal: opts.signal,
      validateStatus: (s) => s === 200 || s === 404,
    });

    const newIndex =
      (res.headers['x-consul-index'] as string | undefined) ?? '0';

    if (res.status === 404 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Consul KV key not found: ${key}`);
    }

    const entry = res.data[0] as { Value: string | null };
    if (!entry.Value) {
      throw new Error(`Consul KV key has empty value: ${key}`);
    }

    const decoded = Buffer.from(entry.Value, 'base64').toString('utf-8');
    let parsed: T;
    try {
      parsed = JSON.parse(decoded) as T;
    } catch (err) {
      throw new Error(
        `Failed to parse JSON for key ${key}: ${(err as Error).message}`,
      );
    }

    return { value: parsed, index: newIndex };
  }

  private parseWaitMs(wait: string): number {
    const match = /^(\d+)(s|m)$/.exec(wait);
    if (!match) return 5 * 60_000;
    const n = parseInt(match[1], 10);
    return match[2] === 'm' ? n * 60_000 : n * 1000;
  }
}
