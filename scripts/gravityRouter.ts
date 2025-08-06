import { calculateGravitationalPull } from './lib/gravityCore'

calculateGravitationalPull({
  nodeDensity: 1024,
  massCenters: ['moon', 'mars', 'sun'],
  biasFactor: 0.87
})