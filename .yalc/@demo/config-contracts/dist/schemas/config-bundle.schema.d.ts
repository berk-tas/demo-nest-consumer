import { z } from "zod";
export declare const ConfigBundleSchema: z.ZodObject<{
    assets: z.ZodArray<z.ZodObject<{
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
    workspaceSettings: z.ZodObject<{
        workspaceSettings: z.ZodRecord<z.ZodString, z.ZodObject<{
            enableExternalValidators: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ConfigBundle = z.infer<typeof ConfigBundleSchema>;
