export function VaultNegotiator() {
  const negotiations = [
    { region: 'us-west', status: 'Accepted', protocol: 'QKE-256', latency: 11 },
    { region: 'eu-central', status: 'Pending', protocol: 'QKE-512', latency: null },
  ];

  return (
    <div>
      <h2>🔐 Vault Negotiation Engine</h2>
      <ul>
        {negotiations.map((n, idx) => (
          <li key={idx}>
            {n.region}: {n.status} — Protocol: {n.protocol} {n.latency ? `(${n.latency}ms)` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}