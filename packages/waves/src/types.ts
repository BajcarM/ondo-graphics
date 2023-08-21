export type WavesComponentOptions = {
  background: {
    fill?: FillOptions
    linearGradient?: LinearGradientOptions
  }
  distribution: [number, number]
  speed: number
  complexity: number
  amplitude: number
  synchronicity: number
  waves: WaveOptions[]
}

export type WaveOptions = {
  stroke?: StrokeOptions
  fill?: FillOptions
  linearGradient?: LinearGradientOptions
}

export type StrokeOptions = {
  color?: string
  width?: number
  dashArray?: string
  dashOffset?: number
  linecap?: 'butt' | 'round' | 'square'
}

export type FillOptions = {
  color?: string
}

export type LinearGradientOptions = {
  direction: 'toTop' | 'toRight' | 'toBottom' | 'toLeft'
  colors: {
    color: string
    offset: number
  }[]
}

// type ShadowOptions = {
//   dx?: number
//   dy?: number
//   stdDeviation?: number
//   floodColor?: string
// }
