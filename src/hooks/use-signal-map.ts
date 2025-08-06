
'use client';

import { useEffect, useState } from "react";
import { fetchConfig, demoSignalMap } from "@/app/actions";
import type { FirebaseConfig } from "@/lib/types";

// A simplified type for the signal portion of the config for the hook's state
type SignalMap = FirebaseConfig['signal'];

export const useSignalMap = () => {
  const [signalMap, setSignalMap] = useState<SignalMap>(demoSignalMap().signal);

  useEffect(() => {
    const refresh = async () => {
      const config = await fetchConfig();
      // Ensure we have a valid object, falling back to the demo signal map
      const newSignalMap = config?.signal ?? demoSignalMap().signal;
      setSignalMap(newSignalMap);
    };
    
    refresh();
    const interval = setInterval(refresh, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return signalMap;
};
