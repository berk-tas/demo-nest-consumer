import { Module } from '@nestjs/common';
import { ConsulClient } from './consul.client';
import { ManifestWatcher } from './manifest-watcher';
import { RuntimeConfigController } from './runtime-config.controller';
import { RuntimeConfigService } from './runtime-config.service';

@Module({
  controllers: [RuntimeConfigController],
  providers: [ConsulClient, RuntimeConfigService, ManifestWatcher],
  exports: [RuntimeConfigService],
})
export class RuntimeConfigModule {}
