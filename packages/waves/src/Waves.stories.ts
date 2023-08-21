import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import { WaveOptions } from './Waves.types'

import './Waves'

const meta: Meta = {
  component: 'waves-component',
  argTypes: {},
}

export default meta

const WAVE_OPTIONS: WaveOptions[] = [
  {
    fill: {
      color: 'yellow',
    },
  },

  {
    linearGradient: {
      direction: 'toRight',
      colors: [
        {
          color: 'red',
          offset: 0,
        },
        {
          color: 'green',
          offset: 0.4,
        },
        {
          color: 'blue',
          offset: 1,
        },
      ],
    },
    stroke: {
      color: 'black',
      width: 0.02,
      dashArray: '0 0.1',
      linecap: 'round',
    },
  },
]

export const Template: StoryObj = {
  render: () =>
    html`<waves-component
      style="height: 1000px; width: 1000px; display: block; border: 1px solid black;

      margin-inline: auto;"
      background=${JSON.stringify({
        linearGradient: {
          direction: 'toRight',
          colors: [
            {
              color: 'red',
              offset: 0,
            },
            {
              color: 'blue',
              offset: 0.4,
            },
            {
              color: 'green',
              offset: 1,
            },
          ],
        },
      })}
      waves=${JSON.stringify(WAVE_OPTIONS)}
    ></waves-component>`,
}
