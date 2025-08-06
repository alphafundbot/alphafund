import { syncVaultSecrets } from './lib/vaultOps'
syncVaultSecrets({ env: process.env.NODE_ENV })