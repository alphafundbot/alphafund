ts
export default function handler(req, res) {
  const { route, reason } = JSON.parse(req.body);

  // Placeholder logic — replace with real model
  const action = reason === 'TierMismatch' ? 'UpgradeTier' : 'RestrictRouting';

  res.status(200).json({ action });
}