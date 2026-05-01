import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  AssetsSchema,
  CONTRACT_VERSION,
  ManifestSchema,
  WorkspaceSettingsConfigSchema,
  type Asset,
  type Manifest,
  type WorkspaceSettingsConfig,
} from '@demo/config-contracts';
import { ConsulClient } from './consul.client';
import {
  ConfigSnapshot,
  LoadError,
  StatusResponse,
} from './types';

@Injectable()
export class RuntimeConfigService {
  private readonly logger = new Logger(RuntimeConfigService.name);
  private current: ConfigSnapshot | null = null;
  private lastError: LoadError | null = null;

  constructor(private readonly consul: ConsulClient) {}

  private manifestKey(): string {
    return `configs/${CONTRACT_VERSION}/manifest.json`;
  }

  private payloadKey(logicalKey: string): string {
    return `configs/${CONTRACT_VERSION}/${logicalKey}.json`;
  }

  async fetchManifest(
    index?: string,
    wait?: string,
    signal?: AbortSignal,
  ): Promise<{ manifest: Manifest; index: string }> {
    const { value, index: newIndex } = await this.consul.getKV<unknown>(
      this.manifestKey(),
      { index, wait, signal },
    );
    const manifest = ManifestSchema.parse(value);
    return { manifest, index: newIndex };
  }

  async applyManifest(
    manifest: Manifest,
    manifestIndex: string,
  ): Promise<void> {
    try {
      const fetched = await Promise.all(
        manifest.keys.map(async (key) => {
          const { value } = await this.consul.getKV<unknown>(
            this.payloadKey(key),
          );
          return { key, value };
        }),
      );

      let assets: Asset[] | undefined;
      let workspaceSettings: WorkspaceSettingsConfig | undefined;

      for (const { key, value } of fetched) {
        if (key === 'assets') {
          assets = AssetsSchema.parse(value);
        } else if (key === 'workspaceSettings') {
          workspaceSettings = WorkspaceSettingsConfigSchema.parse(value);
        } else {
          this.logger.warn(`Unknown manifest key, skipping: ${key}`);
        }
      }

      if (!assets) throw new Error('Manifest missing required key: assets');
      if (!workspaceSettings)
        throw new Error('Manifest missing required key: workspaceSettings');

      const next: ConfigSnapshot = {
        version: CONTRACT_VERSION,
        manifestIndex,
        publishedAt: manifest.publishedAt,
        gitCommit: manifest.gitCommit,
        assets,
        workspaceSettings,
        loadedAt: new Date().toISOString(),
      };

      this.current = next;
      this.lastError = null;
      this.logger.log(
        `Applied config v=${CONTRACT_VERSION} manifestIndex=${manifestIndex} commit=${manifest.gitCommit}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.lastError = { at: new Date().toISOString(), message };
      this.logger.error(
        `Failed to apply manifest (LKG retained): ${message}`,
      );
      throw err;
    }
  }

  async reload(): Promise<StatusResponse> {
    const { manifest, index } = await this.fetchManifest('0');
    await this.applyManifest(manifest, index);
    return this.getStatus();
  }

  getStatus(): StatusResponse {
    const snap = this.current;
    return {
      version: CONTRACT_VERSION,
      hasLastKnownGood: snap !== null,
      manifestIndex: snap?.manifestIndex ?? null,
      publishedAt: snap?.publishedAt ?? null,
      gitCommit: snap?.gitCommit ?? null,
      loadedAt: snap?.loadedAt ?? null,
      lastError: this.lastError,
    };
  }

  getAssets(): Asset[] {
    const snap = this.current;
    if (!snap) throw new ServiceUnavailableException('Config not loaded yet');
    return snap.assets;
  }

  getWorkspaceSettings(): WorkspaceSettingsConfig {
    const snap = this.current;
    if (!snap) throw new ServiceUnavailableException('Config not loaded yet');
    return snap.workspaceSettings;
  }
}
