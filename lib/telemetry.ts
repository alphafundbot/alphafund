import { SignalRoute } from './complianceValidator';

export function logComplianceEvent(route: SignalRoute, status: 'compliant' | 'non-compliant', reason?: string) {
  firestore.collection('mesh/compliance-events').add({
    route,
    status,
    reason,
    timestamp: Date.now(),
  });
}