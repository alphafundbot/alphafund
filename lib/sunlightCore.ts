export function computeSolarBias({ region, timestamp, altitude, cloudCover, solarFlux }) {
  const adjustedFlux = solarFlux * (1 - cloudCover)
  const routingWeight = adjustedFlux * Math.cos(altitude * (Math.PI / 180))
  console.log(`[SunlightRouter] Region: ${region}, Weight: ${routingWeight.toFixed(2)}`)
  return routingWeight
}