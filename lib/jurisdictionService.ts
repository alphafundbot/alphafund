import { firestore } from './firebase';

export async function updateJurisdiction(region: string, allowedRegions: string[], tierOverride: string) {
  await firestore.collection('mesh/jurisdictionMap').doc(region).set({
    allowedRegions,
    tierOverride,
  });
}

export async function fetchJurisdictionMap() {
  const snapshot = await firestore.collection('mesh/jurisdictionMap').get();
  const map: Record<string, any> = {};
  snapshot.forEach(doc => {
    map[doc.id] = doc.data();
  });
  return map;
}