import { WavesComponentOptions } from './Waves.types'

export const defaultOptions: WavesComponentOptions = {
  background: {
    fill: {
      color: 'white',
    },
  },
  speed: 2,
  distribution: [2, 8],
  amplitude: 1, // Movement radius
  complexity: 2, // Noise scaling
  synchronicity: 3, // Noise offset
  waves: [{}, {}],
}
