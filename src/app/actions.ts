
'use client';

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { FirebaseConfig } from "@/lib/types";
import { defaultConfig, serviceConfig } from "@/lib/config";
import { z } from "zod";

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


export const fetchConfig = async (): Promise<FirebaseConfig> => {
  try {
    const docRef = doc(db, "config", "globalSettings");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        const parsed = ConfigSchema.deepPartial().safeParse(snapshot.data());
        if (parsed.success) {
            // Deep merge fetched data with default config to ensure all keys are present
            const merge = (defaultObj: any, newObj: any): any => {
                const result = { ...defaultObj };
                for (const key in newObj) {
                    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
                        if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key]) && defaultObj[key]) {
                            result[key] = merge(defaultObj[key], newObj[key]);
                        } else {
                            result[key] = newObj[key];
                        }
                    }
                }
                return result;
            }
            return merge(defaultConfig, parsed.data);
        }
    }
    return defaultConfig;
  } catch (err) {
    console.error("Config fetch error:", err);
    return defaultConfig;
  }
};

export async function saveConfig(
  config: FirebaseConfig
): Promise<{ success: boolean; message: string }> {
  try {
    const validatedConfig = ConfigSchema.parse(config);
    const docRef = doc(db, "config", "globalSettings");
    await setDoc(docRef, validatedConfig, { merge: true });
    return { success: true, message: 'Configuration saved successfully!' };
  } catch (e) {
    console.error('Failed to save config:', e);
    if (e instanceof z.ZodError) {
      return { success: false, message: 'Invalid configuration data.' };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export const demoSignalMap = () => ({
  signal: {
    cluster1: 0,
    cluster2: 0,
    throughput: [],
    vaultStatus: "awaiting",
    revenueAudit: {
      total: "Demo",
      activeFlow: "None",
    },
    firestoreSignalRouting: true,
    aiFunctionHooks: true,
    strategistMemoryEnabled: true,
  },
});
