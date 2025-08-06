import { isCompliant, JurisdictionalProfile, SignalRoute } from '../lib/complianceValidator';

describe('Jurisdictional Compliance Validator', () => {
  const baseNode: JurisdictionalProfile = {
    region: 'us-west',
    dataSovereignty: true,
    vaultEncrypted: true,
    billingModel: 'flat-rate',
    complianceTier: 'Tier-2',
  };

  it('allows compliant Tier-2 to Tier-2 routing', () => {
    const route: SignalRoute = {
      source: baseNode,
      destination: { ...baseNode, region: 'us-east' },
    };
    expect(isCompliant(route)).toEqual({ compliant: true });
  });

  it('blocks Tier-1 to Tier-3 routing', () => {
    const route: SignalRoute = {
      source: { ...baseNode, complianceTier: 'Tier-1' },
      destination: { ...baseNode, complianceTier: 'Tier-3' },
    };
    expect(isCompliant(route)).toEqual({ compliant: false, reason: 'TierMismatch' });
  });

  it('blocks cross-border routing without whitelist', () => {
    const route: SignalRoute = {
      source: baseNode,
      destination: { ...baseNode, region: 'eu-central' },
    };
    expect(isCompliant(route)).toEqual({ compliant: false, reason: 'SovereigntyViolation' });
  });

  it('allows cross-border routing with whitelist', () => {
    const route: SignalRoute = {
      source: baseNode,
      destination: { ...baseNode, region: 'eu-central' },
      whitelist: ['eu-central'],
    };
    expect(isCompliant(route)).toBe(true);
  });

  it('blocks vaultEncrypted destination if source is not encrypted', () => {
    const route: SignalRoute = {
      source: { ...baseNode, vaultEncrypted: false },
      destination: baseNode,
    };
    expect(isCompliant(route)).toEqual({ compliant: false, reason: 'VaultEncryptionMismatch' });
  });
});