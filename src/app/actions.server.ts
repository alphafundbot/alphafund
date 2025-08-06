'use server';

import { z } from 'zod';
import type { FirebaseConfig } from '@/lib/types';
import { auditConfig, type AuditConfigOutput } from '@/ai/flows/config-auditor';
import adminDb from '@/lib/firebase-admin';
import { serviceConfig } from '@/lib/config';

const ConfigSchema = z.object(
  Object.keys(serviceConfig).reduce((acc, category) => {
    acc[category] = z.object(
      Object.keys(serviceConfig[category as keyof typeof serviceConfig].items).reduce((acc, key) => {
        acc[key] = z.boolean();
        return acc;
      }, {} as Record<string, z.ZodBoolean>)
    );
    return acc;
  }, {} as Record<string, z.ZodObject<any>>)
);

export async function runConfigAudit(config: FirebaseConfig): Promise<{ error?: string, data?: AuditConfigOutput }> {
    if (!adminDb) {
        return { error: 'Firestore admin is not initialized.' };
    }
    try {
        const validatedConfig = ConfigSchema.parse(config);
        const result = await auditConfig({ config: validatedConfig });
        return { data: result };
    } catch (e) {
        console.error('Failed to run audit:', e);
        if (e instanceof z.ZodError) {
          return { error: 'Invalid configuration data provided to audit.' };
        }
        return { error: 'An error occurred during the audit.' };
    }
}

export async function pulseVault(): Promise<{ status: string, reason?: string }> {
    if (!adminDb) {
        return { status: 'error', reason: 'db-not-initialized' };
    }
    const docRef = adminDb.doc("vault/config");
    
    try {
        const snapshot = await docRef.get();
        const config = snapshot.data();

        if (config?.credentialStatus !== "injected") {
            return { status: "vault-blocked", reason: "credentialsMissing" };
        }

        await docRef.update({ meshEntropy: "synced" });
        return { status: "vault-pulsed" };
    } catch (error) {
        console.error("Error pulsing vault:", error);
        return { status: "error", reason: "unknown" };
    }
}
