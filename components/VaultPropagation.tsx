import { useEffect, useState } from 'react';

export function VaultPropagation() {
  const [vaultStatus, setVaultStatus] = useState([
    { region: 'us-west', propagated: true },
    { region: 'eu-central', propagated: false },
  ]);

  return (
    <div>
      <h2>🔐 Vault Propagation</h2>
      <ul>
        {vaultStatus.map((vault, idx) => (
          <li key={idx}>
            {vault.region}: {vault.propagated ? '✅ Propagated' : '❌ Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}