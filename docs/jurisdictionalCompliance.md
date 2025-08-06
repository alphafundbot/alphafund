# Jurisdictional Signal Compliance

This document outlines the logic and requirements for jurisdiction-aware signal routing across strategistMesh nodes.

## 🌍 Node Profile Schema

Each node must declare a `jurisdictionalProfile`:

```
ts
{
  region: 'ap-southeast',
  dataSovereignty: true,
  vaultEncrypted: true,
  billingModel: 'flat-rate',
  complianceTier: 'Tier-2'
}
```

## 🔀 Routing Logic

- Signals must be routed through nodes with matching or higher `complianceTier`.
- Nodes with `dataSovereignty: true` must avoid cross-border routing unless explicitly whitelisted.
- `vaultEncrypted: true` nodes require end-to-end encryption validation before signal ingestion.

## ⚖️ Compliance Enforcement

- Real-time audits triggered on signal ingress/egress.
- Non-compliant paths are flagged and rerouted.
- Billing adjusted based on compliance overhead.

## 🧠 Integration with Cognition Loop

Jurisdictional constraints feed into the recursive cognition layer to evolve routing heuristics and billing predictions.

## 📡 Example

Signal from `us-west` to `eu-central`:
- ✅ Allowed if both nodes are Tier-2 or higher
- ❌ Blocked if `us-west` is Tier-1 and `eu-central` requires Tier-3

