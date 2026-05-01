import { z } from "zod";
export declare const AssetNetworkDetailsSchema: z.ZodObject<{
    chain: z.ZodString;
    contractAddress: z.ZodOptional<z.ZodString>;
    decimals: z.ZodNumber;
}, z.core.$strip>;
export declare const AssetSchema: z.ZodObject<{
    depositSuspended: z.ZodBoolean;
    withdrawSuspended: z.ZodBoolean;
    symbol: z.ZodString;
    name: z.ZodString;
    icon: z.ZodString;
    coinGeckoId: z.ZodString;
    minimumAmountToSweep: z.ZodString;
    gasLimit: z.ZodString;
    networks: z.ZodRecord<z.ZodString, z.ZodObject<{
        chain: z.ZodString;
        contractAddress: z.ZodOptional<z.ZodString>;
        decimals: z.ZodNumber;
    }, z.core.$strip>>;
    isNative: z.ZodBoolean;
    assetAddress: z.ZodString;
    assetType: z.ZodString;
    decimals: z.ZodNumber;
    displayDecimals: z.ZodNumber;
    isHidden: z.ZodBoolean;
}, z.core.$strip>;
export declare const AssetsSchema: z.ZodArray<z.ZodObject<{
    depositSuspended: z.ZodBoolean;
    withdrawSuspended: z.ZodBoolean;
    symbol: z.ZodString;
    name: z.ZodString;
    icon: z.ZodString;
    coinGeckoId: z.ZodString;
    minimumAmountToSweep: z.ZodString;
    gasLimit: z.ZodString;
    networks: z.ZodRecord<z.ZodString, z.ZodObject<{
        chain: z.ZodString;
        contractAddress: z.ZodOptional<z.ZodString>;
        decimals: z.ZodNumber;
    }, z.core.$strip>>;
    isNative: z.ZodBoolean;
    assetAddress: z.ZodString;
    assetType: z.ZodString;
    decimals: z.ZodNumber;
    displayDecimals: z.ZodNumber;
    isHidden: z.ZodBoolean;
}, z.core.$strip>>;
export type AssetNetworkDetails = z.infer<typeof AssetNetworkDetailsSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type Assets = z.infer<typeof AssetsSchema>;
