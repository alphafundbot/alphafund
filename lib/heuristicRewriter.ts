import { SignalRoute } from './complianceValidator';

export async function rewriteHeuristics(route: SignalRoute, reason: string) {
  const response = await fetch('/api/heuristicRewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ route, reason }),
  });
  const data = await response.json();
  return data.adjustedRoute;
}