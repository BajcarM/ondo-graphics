import {
  LitElement,
  PropertyValues,
  SVGTemplateResult,
  TemplateResult,
  css,
  html,
  svg,
} from 'lit'
import { property, queryAll } from 'lit/decorators.js'
import { defaultOptions } from './defaultOptions'
import {
  WAVE_PADDING,
  createStaticWaveShape,
  getHeights,
  mapRange,
  updateWaveShape,
} from './functions/waves/waveFunctions'
import { WaveOptions } from './types'
import { NoiseFunction3D, createNoise3D } from './functions/utils/simplexNoise'
import { WaveShape } from './functions'

export class Waves extends LitElement {
  // Properties from attributes
  @property({
    type: Object,
    hasChanged: (newValue: {}, oldValue: {}) =>
      JSON.stringify(newValue) !== JSON.stringify(oldValue),
  })
  background = defaultOptions.background

  @property({ type: Number })
  speed = defaultOptions.speed

  @property({
    type: Array,
    hasChanged: (newValue: WaveOptions[], oldValue: WaveOptions[]) =>
      JSON.stringify(newValue) !== JSON.stringify(oldValue),
  })
  distribution = defaultOptions.distribution

  @property({ type: Number })
  complexity = defaultOptions.complexity

  @property({ type: Number })
  amplitude = defaultOptions.amplitude

  @property({ type: Number })
  synchronicity = defaultOptions.synchronicity

  @property({
    type: Array,
    hasChanged: (newValue: WaveOptions[], oldValue: WaveOptions[]) =>
      JSON.stringify(newValue) !== JSON.stringify(oldValue),
  })
  waves = defaultOptions.waves

  // Other properties
  #shouldPlay = true

  #intersectionObserver: IntersectionObserver | null = null

  #numberOfPoints = 20

  #noise3dFunction!: NoiseFunction3D

  #noiseTimeline = 0

  #animationFrameId: number | null = null

  #lastTimestamp: number | null = null

  @queryAll('path')
  protected pathElements!: SVGPathElement[]

  #waveShapes: WaveShape[] = []

  // Styles

  static styles = css`
    :host {
      display: block;
    }

    svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  `

  //Lifecycle
  connectedCallback() {
    super.connectedCallback()

    if (!this.hasAttribute('data-source')) {
      this.setAttribute('data-source', 'https://ondo.graphics')
    }
  }

  protected firstUpdated() {
    this.#initializeWaves()

    this.#initializeIntersectionObserver()
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('distribution') ||
      changedProperties.has('synchronicity') ||
      changedProperties.has('waves')
    ) {
      this.#updateWaveShapes()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.#pauseAnimation()

    this.#intersectionObserver?.disconnect()
  }

  // Methods
  #initializeIntersectionObserver() {
    this.#intersectionObserver = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting && this.#shouldPlay) {
          this.#startAnimation()
        } else {
          this.#pauseAnimation()
        }
      },
    )

    this.#intersectionObserver.observe(this)
  }

  #initializeWaves() {
    const heights = getHeights(
      this.distribution[0],
      this.distribution[1],
      this.waves.length,
    )

    this.#noise3dFunction = createNoise3D()

    this.#waveShapes = heights.map((height, index) =>
      createStaticWaveShape(
        height,
        this.#numberOfPoints,
        this.amplitude,
        this.complexity,
        this.synchronicity * index,
        this.#noiseTimeline,
        this.#noise3dFunction,
      ),
    )

    this.pathElements?.forEach((pathElement, index) => {
      pathElement.setAttribute('d', this.#waveShapes[index].path)
    })
  }

  #updateWaveShapes() {
    if (this.#waveShapes.length === 0) {
      return
    }

    // If animation is running, cancel it but leave the ID
    if (this.#animationFrameId) {
      cancelAnimationFrame(this.#animationFrameId)
    }

    const heights = getHeights(
      this.distribution[0],
      this.distribution[1],
      this.waves.length,
    )

    this.#waveShapes = heights.map((height, index) =>
      createStaticWaveShape(
        height,
        this.#numberOfPoints,
        this.amplitude,
        this.complexity,
        this.synchronicity * index,
        this.#noiseTimeline,
        this.#noise3dFunction,
      ),
    )

    // If animation was running, restart it
    if (this.#animationFrameId) {
      this.#animationFrameId = requestAnimationFrame(this.#animate)
    }
  }

  #animate = (timestamp: DOMHighResTimeStamp) => {
    if (!this.pathElements) {
      return
    }

    if (!this.#lastTimestamp) {
      this.#lastTimestamp = timestamp
    }

    const timeElapsed = timestamp - this.#lastTimestamp
    const timeOptimized = timeElapsed < 17 ? timeElapsed : 17

    const speedFormatted = this.speed / 10000

    this.#noiseTimeline += timeOptimized * speedFormatted

    for (const [index, waveShape] of this.#waveShapes.entries()) {
      const { path } = updateWaveShape(
        waveShape,
        this.amplitude,
        this.complexity,
        this.#noiseTimeline,
        this.#noise3dFunction,
      )

      this.pathElements[index]?.setAttribute('d', path)
    }

    this.#animationFrameId = requestAnimationFrame(this.#animate)
  }

  #startAnimation() {
    if (this.#animationFrameId) {
      return
    }

    this.#animationFrameId = requestAnimationFrame(this.#animate)
  }

  #pauseAnimation() {
    if (!this.#animationFrameId) {
      return
    }

    cancelAnimationFrame(this.#animationFrameId)
    this.#animationFrameId = null
  }

  #getCSSVariables() {
    const CSSVariables: TemplateResult<1>[] = []

    // SVG variables
    if (this.background.linearGradient) {
      const { direction, colors } = this.background.linearGradient

      const directionFormatted = direction.toLowerCase().replace('to', 'to ')
      const colorsFormatted = colors.map(({ color, offset }) =>
        offset ? `${color} ${offset * 100}%` : color,
      )

      CSSVariables.push(
        html`
          <style>
            svg {
              background: linear-gradient(
                ${directionFormatted},
                ${colorsFormatted.join(', ')}
              );
            }
          </style>
        `,
      )
    } else {
      CSSVariables.push(
        html`
          <style>
            svg {
              background: var(
                --wave-container-background,
                ${this.background.fill?.color}
              );
            }
          </style>
        `,
      )
    }

    // Wave variables
    this.waves.forEach(({ stroke, fill, linearGradient }, index) =>
      CSSVariables.push(
        html`
          <style>
            path:nth-of-type(${index + 1}) {
              fill: ${linearGradient
                ? `url(#gradient-${index + 1})`
                : `var(--wave-${index + 1}-fill-color, ${fill?.color})`};

              stroke: var(--wave-${index + 1}-stroke-color, ${stroke?.color});
              stroke-width: var(
                --wave-${index + 1}-stroke-width,
                ${stroke?.width}
              );

              stroke-dasharray: var(
                --wave-${index + 1}-stroke-dasharray,
                ${stroke?.dashArray}
              );
              stroke-dashoffset: var(
                --wave-${index + 1}-stroke-dashoffset,
                ${stroke?.dashOffset}
              );
              stroke-linecap: var(
                --wave-${index + 1}-stroke-linecap,
                ${stroke?.linecap}
              );

              filter: url(#shadow-${index + 1});
            }
          </style>
        `,
      ),
    )

    return CSSVariables
  }

  #getLinearGradients() {
    const linearGradients = this.waves.reduce<SVGTemplateResult[]>(
      (acc, { linearGradient }, index) => {
        if (!linearGradient) {
          return acc
        }

        const { direction, colors } = linearGradient

        // Waves have padding so need to adjust stops
        const paddingAsRatio = WAVE_PADDING / (1 + 2 * WAVE_PADDING) / 2

        const firstStop = svg`
        <stop offset=${Math.floor(paddingAsRatio * 100)}% stop-color=${
          colors[0].color
        } />
        `

        const lastStop = svg`
        <stop offset=${Math.ceil((1 - paddingAsRatio) * 100)}% stop-color=${
          colors[colors.length - 1].color
        } />
        `

        const gradientTemplate = svg`
          <linearGradient
            id="gradient-${index + 1}"
            x1=${direction === 'toLeft' ? '1' : '0'}
            y1=${direction === 'toTop' ? '1' : '0'}
            x2=${direction === 'toRight' ? '1' : '0'}
            y2=${direction === 'toBottom' ? '1' : '0'}
          >
            ${firstStop}

            ${colors.map(({ color, offset }) => {
              const offsetFormatted = mapRange(
                offset,
                0,
                1,
                paddingAsRatio,
                1 - paddingAsRatio,
              )

              return svg`
                  <stop
                    offset=${Math.round(offsetFormatted * 100)}%
                    stop-color=${color}
              />`
            })}

            ${lastStop}
          </linearGradient>`

        return [...acc, gradientTemplate]
      },
      [],
    )

    return linearGradients
  }

  // Removed for now due to perfomance
  // #getShadows() {
  //   const shadows = this.waves.reduce<SVGTemplateResult[]>(
  //     (acc, { shadow }, index) => {
  //       if (!shadow) {
  //         return acc
  //       }

  //       const { dx, dy, stdDeviation, floodColor } = shadow

  //       const shadowTemplate = svg`
  //         <filter id="shadow-${index + 1}">
  //           <feDropShadow
  //             dx=${dx}
  //             dy=${dy}
  //             stdDeviation=${stdDeviation}
  //             flood-color=${floodColor} />
  //         </filter>`

  //       return [...acc, shadowTemplate]
  //     },
  //     [],
  //   )

  //   return shadows
  // }

  #getWavePaths() {
    const wavePaths = this.waves.map(
      (_, index) => svg`<path id="wave-${index + 1}"/>`,
    )

    return wavePaths
  }

  #getSVGTemplate() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        ${this.#getCSSVariables()}

        <defs>${this.#getLinearGradients()}</defs>

        ${this.#getWavePaths()}
      </svg>
    `
  }

  // Render
  render() {
    return this.#getSVGTemplate()
  }
}

const TAG_NAME = 'og-waves' as const

// Custom register with condition bcause of SSR
export function registerWavesComponent() {
  customElements.get(TAG_NAME) || customElements.define(TAG_NAME, Waves)
}

if (typeof window !== 'undefined') {
  registerWavesComponent()
}

// Declare the custom element in HTMLElementTagNameMap
declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: Waves
  }
}
