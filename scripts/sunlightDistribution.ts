import { computeSolarBias } from './lib/sunlightCore'

computeSolarBias({
  region: 'us-west',
  timestamp: Date.now(),
  altitude: 42.7,
  cloudCover: 0.12,
  solarFlux: 1361 // W/m² at Earth's surface
})