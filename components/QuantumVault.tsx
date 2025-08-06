import { useState } from 'react';

export function QuantumVault() {
  const [vaults, setVaults] = useState([
    { region: 'us-west', entangled: true, latency: 12 },
    { region: 'eu-central', entangled: false, latency: null },
  ]);

  return (
    <div>
      <h2>🧬 Quantum Vault Propagation</h2>
      <ul>
        {vaults.map((v, idx) => (
          <li key={idx}>
            {v.region}: {v.entangled ? `✅ Entangled (${v.latency}ms)` : '❌ Not Entangled'}
          </li>
        ))}
      </ul>
    </div>
  );
}