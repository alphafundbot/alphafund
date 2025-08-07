
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SystemStatus, StatusLevel } from '@/lib/types';

const initialStatus: SystemStatus = {
  nodesOnline: 0,
  revenueTotal: '$0.00',
  meshEntropy: 'online',
  access: 'online',
  credentialStatus: 'notInjected',
  lastAudit: new Date().toISOString(),
  modules: {
    signal: false,
    finance: false,
    governance: false,
    planetary: false,
  },
};

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>(initialStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    const docRef = doc(db, 'vault', 'config');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStatus({
            ...initialStatus,
            ...data,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching system status:", error);
        setStatus(initialStatus);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { status, loading };
}
