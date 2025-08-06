
'use client';

import { useEffect, useState } from "react";
import { fetchConfig } from "@/app/actions";
import type { FirebaseConfig } from "@/lib/types";
import { defaultConfig } from "@/lib/config";

type SignalMap = FirebaseConfig['signal'];

export const useSignalMap = () => {
  const [signalMap, setSignalMap] = useState<SignalMap>(defaultConfig.signal);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      try {
        const config = await fetchConfig();
        const newSignalMap = config?.signal ?? defaultConfig.signal;
        setSignalMap(newSignalMap);
      } catch (error) {
        console.error("Failed to fetch signal map:", error);
        setSignalMap(defaultConfig.signal);
      } finally {
        setLoading(false);
      }
    };
    
    refresh();
    const interval = setInterval(refresh, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { signal: signalMap, loading };
};
