import { routeSignal } from './signalRouter';
import { JurisdictionalProfile } from './complianceValidator';

export function simulateMeshSignals(nodes: JurisdictionalProfile[], iterations = 1000000) {
  let compliantCount = 0;
  let violations = {};

  for (let i = 0; i < iterations; i++) {
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    const destination = nodes[Math.floor(Math.random() * nodes.length)];
    const route = { source, destination };

    const result = routeSignal(route);
    if (result.compliant) {
      compliantCount++;
    } else {
      const reason = result.reason;
      violations[reason] = (violations[reason] || 0) + 1;
    }
  }

  console.log(`✅ Compliant: ${compliantCount} / ${iterations}`);
  console.log(`⚠️ Violations:`, violations);
}