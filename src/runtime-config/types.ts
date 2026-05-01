import type { Asset, WorkspaceSettingsConfig } from '@demo/config-contracts';

export interface ConfigSnapshot {
  version: string;
  manifestIndex: string;
  publishedAt: string;
  gitCommit: string;
  assets: Asset[];
  workspaceSettings: WorkspaceSettingsConfig;
  loadedAt: string;
}

export interface LoadError {
  at: string;
  message: string;
}

export interface StatusResponse {
  version: string;
  hasLastKnownGood: boolean;
  manifestIndex: string | null;
  publishedAt: string | null;
  gitCommit: string | null;
  loadedAt: string | null;
  lastError: LoadError | null;
}
