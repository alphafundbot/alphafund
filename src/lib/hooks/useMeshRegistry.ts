import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase'; // assuming your firestore instance
import type { MeshNode } from '@/lib/config-types';

export const useMeshRegistry = () => {
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([]);

  useEffect(() => {
    const ref = collection(firestore, 'meshNodes');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const nodes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          nodeId: doc.id, // Assuming document ID is the nodeId
          region: data.region,
          telemetry: data.telemetry
        } as MeshNode; // Asserting the type
      });
      setMeshNodes(nodes);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  return meshNodes;
};