export function SignalStressSimulator() {
  const results = [
    { region: 'us-west', signals: 1000000, violations: 12 },
    { region: 'eu-central', signals: 800000, violations: 18 },
  ];

  return (
    <div>
      <h2>🧪 Signal Stress Simulator</h2>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            {r.region}: {r.signals.toLocaleString()} signals — {r.violations} violations
          </li>
        ))}
      </ul>
    </div>
  );
}