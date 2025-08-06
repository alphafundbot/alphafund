import { evolveSignalHeuristics } from './lib/cognitionCore'

evolveSignalHeuristics({
  inputs: ['latency', 'solarFlux', 'gravitationalBias', 'billingRate'],
  strategy: 'recursive-adaptive',
  loopDepth: 3
})