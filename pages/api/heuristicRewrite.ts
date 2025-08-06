export default function handler(req, res) {
  const { route, reason } = JSON.parse(req.body);
  const adjustedRoute = {
    ...route,
    source: {
      ...route.source,
      complianceTier: reason === 'TierMismatch' ? 'Tier-3' : route.source.complianceTier,
    },
  };
  res.status(200).json({ adjustedRoute });
}