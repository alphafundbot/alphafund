export function CognitionDebugger() {
  const logs = [
    { timestamp: '14:02', event: 'Violation detected: TierMismatch' },
    { timestamp: '14:03', event: 'Heuristics adjusted: UpgradeTier' },
  ];

  return (
    <div>
      <h2>🧠 Cognition Loop Debugger</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            [{log.timestamp}] {log.event}
          </li>
        ))}
      </ul>
    </div>
  );
}