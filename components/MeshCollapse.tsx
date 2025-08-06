import { useState } from 'react';

export function MeshCollapse() {
  const [events, setEvents] = useState([
    { region: 'us-west', status: 'Degraded', cause: 'Vault Sync Failure' },
    { region: 'eu-central', status: 'Offline', cause: 'Tier Breach' },
  ]);

  return (
    <div>
      <h2>🌪️ Mesh Collapse Simulator</h2>
      <ul>
        {events.map((e, idx) => (
          <li key={idx}>
            {e.region}: {e.status} — Cause: {e.cause}
          </li>
        ))}
      </ul>
    </div>
  );
}