import { useState } from 'react';

export function MVNOManager() {
  const [mvnos, setMvnos] = useState([
    { name: 'NovaTel', billingModel: 'flat-rate', complianceTier: 'Tier-2' },
    { name: 'QuantumLink', billingModel: 'usage-based', complianceTier: 'Tier-3' },
  ]);

  return (
    <div>
      <h2>📶 MVNO Configuration</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Billing</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          {mvnos.map((mvno, idx) => (
            <tr key={idx}>
              <td>{mvno.name}</td>
              <td>{mvno.billingModel}</td>
              <td>{mvno.complianceTier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}