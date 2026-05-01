"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsSchema = exports.AssetSchema = exports.AssetNetworkDetailsSchema = void 0;
const zod_1 = require("zod");
exports.AssetNetworkDetailsSchema = zod_1.z.object({
    chain: zod_1.z.string().min(1),
    contractAddress: zod_1.z.string().min(1).optional(),
    decimals: zod_1.z.number().int().min(0),
});
exports.AssetSchema = zod_1.z.object({
    depositSuspended: zod_1.z.boolean(),
    withdrawSuspended: zod_1.z.boolean(),
    symbol: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    coinGeckoId: zod_1.z.string().min(1),
    minimumAmountToSweep: zod_1.z.string().min(1),
    gasLimit: zod_1.z.string().min(1),
    networks: zod_1.z.record(zod_1.z.string().min(1), exports.AssetNetworkDetailsSchema),
    isNative: zod_1.z.boolean(),
    assetAddress: zod_1.z.string(),
    assetType: zod_1.z.string().min(1),
    decimals: zod_1.z.number().int().min(0),
    displayDecimals: zod_1.z.number().int().min(0),
    isHidden: zod_1.z.boolean(),
});
exports.AssetsSchema = zod_1.z.array(exports.AssetSchema);
