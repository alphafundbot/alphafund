import { SignalRoute } from './complianceValidator';

type ViolationLog = {
  route: SignalRoute;
  reason: string;
  timestamp: number;
};

const violationHistory: ViolationLog[] = [];

export function registerViolation(route: SignalRoute, reason: string) {
  const log: ViolationLog = { route, reason, timestamp: Date.now() };
  violationHistory.push(log);

  console.warn(`⚠️ Violation: ${reason} | ${route.source.region} → ${route.destination.region}`);

  // Adaptive heuristics update
  adjustHeuristics(route, reason);
}

function adjustHeuristics(route: SignalRoute, reason: string) {
  console.log(`🔁 Triggering predictive model for heuristics adjustment due to ${reason}...`);
  // Call to a hypothetical predictive model API
  fetch('https://your-predictive-model-api.com/adjust-heuristics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ route, reason }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('📊 Predictive model response:', data);
    // Implement logic to apply adjusted heuristics from the response
  })
  .catch(error => {
    console.error('❌ Error calling predictive model API:', error);
  });
}