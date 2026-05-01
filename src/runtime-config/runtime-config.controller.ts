import { Controller, Get, Post } from '@nestjs/common';
import type { Asset, WorkspaceSettingsConfig } from '@demo/config-contracts';
import { RuntimeConfigService } from './runtime-config.service';
import { StatusResponse } from './types';

@Controller('runtime-config')
export class RuntimeConfigController {
  constructor(private readonly runtime: RuntimeConfigService) {}

  @Get('status')
  status(): StatusResponse {
    return this.runtime.getStatus();
  }

  @Get('assets')
  assets(): Asset[] {
    return this.runtime.getAssets();
  }

  @Get('workspace-settings')
  workspaceSettings(): WorkspaceSettingsConfig {
    return this.runtime.getWorkspaceSettings();
  }

  @Get('reload')
  reload(): Promise<StatusResponse> {
    return this.runtime.reload();
  }
}
