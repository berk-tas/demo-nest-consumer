import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CONTRACT_VERSION } from '@demo/config-contracts';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable()
export class ManifestWatcher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ManifestWatcher.name);
  private stopped = false;
  private abort?: AbortController;
  private loopPromise?: Promise<void>;

  constructor(private readonly runtime: RuntimeConfigService) {}

  onModuleInit(): void {
    this.loopPromise = this.run();
  }

  async onModuleDestroy(): Promise<void> {
    this.stopped = true;
    this.abort?.abort();
    if (this.loopPromise) {
      await this.loopPromise.catch(() => undefined);
    }
  }

  private async run(): Promise<void> {
    this.logger.log(
      `Watching configs/${CONTRACT_VERSION}/manifest.json via Consul blocking queries`,
    );
    let lastIndex = '0';

    while (!this.stopped) {
      this.abort = new AbortController();
      try {
        const { manifest, index } = await this.runtime.fetchManifest(
          lastIndex,
          undefined,
          this.abort.signal,
        );

        if (this.stopped) return;

        const numericNew = Number(index);
        const numericOld = Number(lastIndex);
        if (Number.isFinite(numericNew) && numericNew <= numericOld) {
          continue;
        }

        try {
          await this.runtime.applyManifest(manifest, index);
        } catch {
          // already logged; LKG retained
        }
        lastIndex = index;
      } catch (err) {
        if (this.stopped) return;
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `Manifest watch error (will retry): ${message}`,
        );
        await this.sleep(2000 + Math.floor(Math.random() * 1000));
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
