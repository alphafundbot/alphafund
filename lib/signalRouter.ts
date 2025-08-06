import { isCompliant, SignalRoute } from './complianceValidator';
import { registerViolation } from './cognitionLoop';
import { logComplianceEvent } from './telemetry';

export function routeSignal(route: SignalRoute) {
  const result = isCompliant(route);

  if (!result.compliant) {
    registerViolation(route, result.reason!);
    logComplianceEvent(route, 'non-compliant', result.reason);
    // Reroute or drop signal
    return false;
  }

  logComplianceEvent(route, 'compliant');
  // Proceed with routing
  return true;
}