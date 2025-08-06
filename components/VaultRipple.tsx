import { useEffect, useState } from 'react';

export function VaultRipple() {
  const [ripples, setRipples] = useState([
    { region: 'us-west', ripple: '✓', delay: '12ms' },
    { region: 'eu-central', ripple: '✓', delay: '18ms' },
    { region: 'ap-southeast', ripple: '✗', delay: '—' },
  ]);

  return (
    <div>
      <h2>🌊 Vault Ripple Propagation</h2>
      <ul>
        {ripples.map((r, idx) => (
          <li key={idx}>
            {r.region}: Ripple {r.ripple} — Delay: {r.delay}
          </li>
        ))}
      </ul>
    </div>
  );
}