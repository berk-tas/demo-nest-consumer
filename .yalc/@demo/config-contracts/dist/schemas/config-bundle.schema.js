"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigBundleSchema = void 0;
const zod_1 = require("zod");
const assets_schema_1 = require("./assets.schema");
const workspace_settings_schema_1 = require("./workspace-settings.schema");
exports.ConfigBundleSchema = zod_1.z.object({
    assets: assets_schema_1.AssetsSchema,
    workspaceSettings: workspace_settings_schema_1.WorkspaceSettingsConfigSchema,
});
