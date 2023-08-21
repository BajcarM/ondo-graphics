import type { Meta, StoryObj } from '@storybook/react'
import { OGWavesPropsWithRef, WaveOptions } from './types'
import { OGWaves } from './OGWaves'

const meta: Meta<typeof OGWaves> = {
  component: OGWaves,
}

export default meta

const WAVES_OPTIONS: WaveOptions[] = [
  {
    fill: {
      color: 'rgba(255,255,0,1)',
    },
    stroke: {
      color: 'rgba(0,0,0,1)',
      width: 0.01,
      dashArray: 'none',
      dashOffset: 0,
      linecap: 'butt',
    },
  },
]

const OGWAVES_OPTIONS: OGWavesPropsWithRef = {
  background: {
    fill: {
      color: 'rgba(255,255,255,1)',
    },
  },
  speed: 2,
  distribution: [2, 8],
  amplitude: 1, // Movement radius
  complexity: 2, // Noise scaling
  synchronicity: 3, // Noise offset
  waves: WAVES_OPTIONS,
  style: {
    width: 1000,
    height: 1000,
    marginInline: 'auto',
  },
}

export const Template: StoryObj<typeof OGWaves> = {
  render: () => <OGWaves {...OGWAVES_OPTIONS} />,
}
