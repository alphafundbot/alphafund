export function SignalLatencyMap() {
  const traces = [
    { path: 'us-west → eu-central', latency: 220 },
    { path: 'us-east → ca-central', latency: 80 },
  ];

  return (
    <div>
      <h2>🛰️ Signal Latency Map</h2>
      <ul>
        {traces.map((trace, idx) => (
          <li key={idx}>
            {trace.path}: {trace.latency}ms
          </li>
        ))}
      </ul>
    </div>
  );
}