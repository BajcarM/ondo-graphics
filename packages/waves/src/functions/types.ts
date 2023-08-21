export type Vector2D = [number, number]

export type WaveShape = {
  pointsOrigins: Vector2D[]
  pointsPositions: Vector2D[]
  pointsNoiseCoords: Vector2D[]
  path: string
  corners: [Vector2D, Vector2D]
}

export type AnimateWavesOptions = {
  position?: 'top' | 'right' | 'bottom' | 'left'
  speed?: number
  lowestWaveHeight?: number
  highestWaveHeight?: number
  smoothness?: number
  amplitude?: number
  complexity?: number
  differenceBetweenWaves?: number
}

export type getRandomWavesOptions = {
  position?: 'top' | 'right' | 'bottom' | 'left'
  lowestWaveHeight?: number
  highestWaveHeight?: number
  smoothness?: number
  amplitude?: number
  complexity?: number
  differenceBetweenWaves?: number
}
