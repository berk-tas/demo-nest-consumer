import { z } from "zod";
export declare const WorkspaceSettingsSchema: z.ZodObject<{
    enableExternalValidators: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const WorkspaceSettingsConfigSchema: z.ZodObject<{
    workspaceSettings: z.ZodRecord<z.ZodString, z.ZodObject<{
        enableExternalValidators: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkspaceSettings = z.infer<typeof WorkspaceSettingsSchema>;
export type WorkspaceSettingsConfig = z.infer<typeof WorkspaceSettingsConfigSchema>;
