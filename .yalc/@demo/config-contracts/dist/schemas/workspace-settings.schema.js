"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSettingsConfigSchema = exports.WorkspaceSettingsSchema = void 0;
const zod_1 = require("zod");
exports.WorkspaceSettingsSchema = zod_1.z.object({
    enableExternalValidators: zod_1.z.boolean().optional(),
});
exports.WorkspaceSettingsConfigSchema = zod_1.z.object({
    workspaceSettings: zod_1.z.record(zod_1.z.string().min(1), exports.WorkspaceSettingsSchema),
});
