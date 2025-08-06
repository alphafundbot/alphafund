export function SignalObservatory() {
  const hops = [
    { path: 'us-west → us-east → eu-central', latency: 240, tier: 'Tier-2' },
    { path: 'ca-central → eu-north', latency: 180, tier: 'Tier-3' },
  ];

  return (
    <div>
      <h2>🛰️ Mesh Signal Observatory</h2>
      <ul>
        {hops.map((hop, idx) => (
          <li key={idx}>
            {hop.path} — {hop.latency}ms — {hop.tier}
          </li>
        ))}
      </ul>
    </div>
  );
}