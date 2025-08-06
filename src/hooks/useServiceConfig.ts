'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, Firestore } from 'firebase/firestore';
import { ServiceCategoryConfig } from '@/lib/config-types'; // Assuming config-types.ts is in src/lib

// Assuming db is your initialized Firestore instance, imported from a file like '@/lib/firebase'
// import { db } from '@/lib/firebase';

const useServiceConfig = (db: Firestore, category: string) => {
  const [config, setConfig] = useState<ServiceCategoryConfig | null>(null);

  useEffect(() => {
    if (!db || !category) {
      setConfig(null);
      return;
    }

    // Construct the document path based on your Firestore structure.
    // This is an example path, adjust it to match your actual Firestore data.
    const configRef = doc(db, 'serviceConfigs', category);

    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        // Assert the data to the ServiceCategoryConfig type
        setConfig(docSnap.data() as ServiceCategoryConfig);
      } else {
        setConfig(null);
      }
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, [db, category]); // Re-run effect if db or category changes

  return config;
};

export default useServiceConfig;