import { Vector2D, WaveShape } from '../types'
import { createOpenCubicSpline } from '../utils/createCubicSpline'
import { NoiseFunction3D } from '../utils/simplexNoise'

export const WAVE_PADDING = 0.1

// For mapping gradients because of wave padding
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export function generatePointsOnLine(
  start: Vector2D,
  end: Vector2D,
  numPoints: number,
  additionalPointsForSpline = true,
): Vector2D[] {
  const pointsCoords: Vector2D[] = []
  const xIncrement = (end[0] - start[0]) / numPoints

  if (additionalPointsForSpline) {
    pointsCoords.push([start[0] - WAVE_PADDING * 2, start[1]])
    pointsCoords.push([start[0] - WAVE_PADDING, start[1]])
  }

  for (let i = 0; i < numPoints; i++) {
    const x = start[0] + xIncrement * i
    const y = start[1]
    pointsCoords.push([x, y])
  }

  if (additionalPointsForSpline) {
    pointsCoords.push([end[0], end[1]])
    pointsCoords.push([end[0] + WAVE_PADDING, end[1]])
    pointsCoords.push([end[0] + WAVE_PADDING * 2, end[1]])
  }

  return pointsCoords
}

export function createStaticWaveShape(
  waveHeight: number,
  numPoints: number,
  amplitude: number,
  complexity: number,
  synchronicity: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  // Format options for better user experience
  const amplitudeFormatted = amplitude / 10
  const synchronicityFormatted = synchronicity / 10

  const { start, end, corner1, corner2 } = getCorners(waveHeight)

  const pointsOrigins = generatePointsOnLine(start, end, numPoints)
  const pointsNoiseCoords = getNoiseCoords(
    pointsOrigins,
    synchronicityFormatted,
  )

  const pointsPositions = pointsOrigins.map((point, index) => {
    // Waves can have different offset in svg from noise plane
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * complexity,
      noiseCoords[1] * complexity,
      noiseTimeline,
    )

    const pointPosition: Vector2D = [
      point[0],
      point[1] + (noiseValue * amplitudeFormatted) / 2,
    ]

    return pointPosition
  })

  const wavePath = createOpenCubicSpline(pointsPositions, 2)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    pointsOrigins,
    pointsPositions,
    pointsNoiseCoords,
    path,
    corners: [corner1, corner2],
  }
}

/**
 * Returns the coordinates of the other 2 corners outside svg so stroke is not visible
 */
export function getCorners(waveHeight: number) {
  const start: Vector2D = [0, 1 - waveHeight]
  const end: Vector2D = [1, 1 - waveHeight]
  const corner1: Vector2D = [1 + WAVE_PADDING, 1 + WAVE_PADDING]
  const corner2: Vector2D = [0 - WAVE_PADDING, 1 + WAVE_PADDING]

  return { start, end, corner1, corner2 }
}

/**
 * Returns the noise coordinates for each point
 */
export function getNoiseCoords(pointsOrigin: Vector2D[], noiseOffset: number) {
  const noiseCoords = pointsOrigin.map((point) => [
    point[0],
    point[1] * noiseOffset,
  ])

  return noiseCoords as Vector2D[]
}

export function getHeights(
  heightFrom: number,
  heightTo: number,
  numWaves: number,
) {
  const heightFromFormatted = heightFrom / 10
  const heightToFormatted = heightTo / 10

  const heightDifference = heightToFormatted - heightFromFormatted

  const heights = Array.from({ length: numWaves }, (_, index) => {
    if (numWaves === 1) {
      return heightFromFormatted
    }

    const height =
      heightToFormatted - heightDifference * (index / (numWaves - 1))

    return height
  })

  return heights
}

/**
 * Returns the new position of a point based on the noise value
 */
export function getPointPosition(
  point: Vector2D,
  amplitude: number,
  noiseValue: number,
) {
  const pointPosition: Vector2D = [
    point[0],
    point[1] + (noiseValue * amplitude) / 2,
  ]

  return pointPosition
}

/**
 * Updates the wave shape with new noise values
 */
export function updateWaveShape(
  waveShape: WaveShape,
  amplitude: number,
  complexity: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  const amplitudeFormatted = amplitude / 10

  const {
    pointsOrigins,
    pointsNoiseCoords,
    corners: [corner1, corner2],
  } = waveShape

  const pointsPositions = new Array(pointsOrigins.length)

  for (let index = 0; index < pointsOrigins.length; index++) {
    const point = pointsOrigins[index]
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * complexity,
      noiseCoords[1] * complexity,
      noiseTimeline,
    )

    const pointPosition = getPointPosition(
      point,
      amplitudeFormatted,
      noiseValue,
    )

    pointsPositions[index] = pointPosition
  }

  const wavePath = createOpenCubicSpline(pointsPositions, 2)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    ...waveShape,
    pointsPositions,
    path,
  }
}

/**
 * Returns the SVG element and all the PATH elements inside it
 * @param svg SVG element or selector
 * @returns SVG element and PATH elements
 */
export function getElements(svg: SVGSVGElement | string) {
  const svgElement = typeof svg === 'string' ? document.querySelector(svg) : svg

  if (!svgElement) {
    console.error('Fluid-Waves: SVG element not found')
    return {
      svgElement: null,
      pathElements: null,
    }
  }

  if (!(svgElement instanceof SVGSVGElement)) {
    console.error('Fluid-Waves: Element is not an SVG element')
    return {
      svgElement: null,
      pathElements: null,
    }
  }

  const pathElements = Array.from(svgElement.querySelectorAll('path'))

  if (pathElements.length === 0) {
    console.error('Fluid-Waves: No PATH elements found')
    return {
      svgElement: svgElement,
      pathElements: null,
    }
  }

  return { svgElement, pathElements }
}
