import { z } from "zod";
export declare const ManifestSchema: z.ZodObject<{
    contractVersion: z.ZodLiteral<"1.0.0">;
    publishedAt: z.ZodString;
    gitCommit: z.ZodString;
    keys: z.ZodArray<z.ZodEnum<{
        workspaceSettings: "workspaceSettings";
        assets: "assets";
    }>>;
}, z.core.$strip>;
export type Manifest = z.infer<typeof ManifestSchema>;
