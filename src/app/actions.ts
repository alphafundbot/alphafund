
'use server';

import { z } from 'zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { serviceConfig, defaultConfig } from '@/lib/config';
import type { FirebaseConfig } from '@/lib/types';
import { auditConfig, type AuditConfigOutput } from '@/ai/flows/config-auditor';
import adminDb from '@/lib/firebase-admin';


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

export async function fetchConfig(): Promise<FirebaseConfig> {
  const configRef = adminDb.collection('config').doc('globalSettings');
  try {
    const snapshot = await configRef.get();
    if (snapshot.exists) {
      const parsed = ConfigSchema.partial().safeParse(snapshot.data());
      if (parsed.success) {
        return { ...defaultConfig, ...parsed.data };
      }
    }
    return defaultConfig;
  } catch (e) {
    console.error('Failed to fetch config:', e);
    return defaultConfig;
  }
}

export async function saveConfig(
  config: FirebaseConfig
): Promise<{ success: boolean; message: string }> {
  const configRef = adminDb.collection('config').doc('globalSettings');
  try {
    const validatedConfig = ConfigSchema.parse(config);
    await configRef.set(validatedConfig, { merge: true });
    return { success: true, message: 'Configuration saved successfully!' };
  } catch (e) {
    console.error('Failed to save config:', e);
    if (e instanceof z.ZodError) {
      return { success: false, message: 'Invalid configuration data.' };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function runConfigAudit(config: FirebaseConfig): Promise<{ error?: string, data?: AuditConfigOutput }> {
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
