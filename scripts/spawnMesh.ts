import { generateMeshCluster } from './lib/meshCore'
generateMeshCluster({ region: process.env.MESH_REGION, nodes: 256 })