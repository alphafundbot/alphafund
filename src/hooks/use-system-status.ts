
'use client';

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '@/lib/firebase';

const defaultStatus = {
  access: "pending",
  meshEntropy: "inactive",
  modules: {
    signal: false,
    finance: false,
    governance: false,
    planetary: false
  },
  credentialStatus: "notInjected",
  lastAudit: new Date().toISOString(),
  nodesOnline: 0,
  revenueTotal: "$0.00"
};

export type SystemStatus = typeof defaultStatus;

export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>(defaultStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
        console.warn("Firestore not initialized, using default status.");
        setLoading(false);
        return;
    }

    const docRef = doc(db, "vault", "config");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus({
            access: data.access ?? defaultStatus.access,
            meshEntropy: data.meshEntropy ?? defaultStatus.meshEntropy,
            modules: data.modules ?? defaultStatus.modules,
            credentialStatus: data.credentialStatus ?? defaultStatus.credentialStatus,
            lastAudit: data.lastAudit ?? defaultStatus.lastAudit,
            nodesOnline: data.nodesOnline ?? defaultStatus.nodesOnline,
            revenueTotal: data.revenueTotal ?? defaultStatus.revenueTotal
        });
      } else {
        console.warn("Vault config document not found, using default status.");
        setStatus(defaultStatus);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching system status:", error);
        setStatus(defaultStatus);
        setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return { status, loading };
};
