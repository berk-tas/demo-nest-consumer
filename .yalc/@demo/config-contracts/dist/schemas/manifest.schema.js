"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestSchema = void 0;
const zod_1 = require("zod");
const version_1 = require("../version");
exports.ManifestSchema = zod_1.z.object({
    contractVersion: zod_1.z.literal(version_1.CONTRACT_VERSION),
    publishedAt: zod_1.z.string(),
    gitCommit: zod_1.z.string(),
    keys: zod_1.z.array(zod_1.z.enum(["assets", "workspaceSettings"])),
});
