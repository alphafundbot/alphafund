import jurisdictionMap from '../config/jurisdictionMap.json';

export interface JurisdictionalProfile {
  region: string;
  dataSovereignty: boolean;
  vaultEncrypted: boolean;
  billingModel: 'flat-rate' | 'usage-based';
  complianceTier: 'Tier-1' | 'Tier-2' | 'Tier-3';
}

export interface SignalRoute {
  source: JurisdictionalProfile;
  destination: JurisdictionalProfile;
  whitelist?: string[];
}
export interface ComplianceResult {
 compliant: boolean;
  reason?: string;
}

export function isCompliant(route: SignalRoute): ComplianceResult {
  const { source, destination } = route;
  // Tier check
  const tierOrder = { 'Tier-1': 1, 'Tier-2': 2, 'Tier-3': 3 };

  const sourceMap = jurisdictionMap[source.region as keyof typeof jurisdictionMap];
  const allowedRegions = sourceMap?.allowedRegions || [];
  const overrideTier = sourceMap?.tierOverride || source.complianceTier;

  if (tierOrder[overrideTier] < tierOrder[destination.complianceTier]) {
 return { compliant: false, reason: 'TierMismatch' };
  }


  // Sovereignty check
  if (source.dataSovereignty && source.region !== destination.region && !allowedRegions.includes(destination.region)) {
    return { compliant: false, reason: 'SovereigntyViolation' };
  }
  // Vault encryption check
  if (destination.vaultEncrypted && !source.vaultEncrypted) {
    return { compliant: false, reason: 'VaultEncryptionMismatch' };
  }

 return { compliant: true };
}