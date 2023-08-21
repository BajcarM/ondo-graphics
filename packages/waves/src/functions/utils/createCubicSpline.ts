import { Vector2D } from '../types'

/**
 * Creates a cubic spline path that goes through all the points and closes the path if needed.
 * Not closed path needs additional 2 points at the beginning and end of the array.
 * @returns d attribute for a path element
 */
export function createCubicSpline(
  points: Vector2D[],
  tension = 2,
  closed = true,
): string {
  // Normalize the tension value for better user experience
  const normalizedTension = tension / 10

  const firstPoint = points[0]
  const secondPoint = points[1]
  const lastPoint = points[points.length - 1]

  // Add two extra points to the beginning and end of the array to allow the spline to go through the first and last point and close the path
  const formattedPoints = closed
    ? [lastPoint, ...points, firstPoint, secondPoint]
    : points

  // Calculate the control points for each point and create the path
  const d = formattedPoints.reduce((acc, point, i, points) => {
    if (i < 2 || i > points.length - 2) return acc

    const [x0, y0] = points[i - 2]
    const [x1, y1] = points[i - 1]
    const [x2, y2] = point
    const [x3, y3] = points[i + 1]

    const cp1x = x1 + (x2 - x0) * normalizedTension
    const cp1y = y1 + (y2 - y0) * normalizedTension
    const cp2x = x2 - (x3 - x1) * normalizedTension
    const cp2y = y2 - (y3 - y1) * normalizedTension

    const path = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`

    return acc + path
  }, `M ${firstPoint[0]},${firstPoint[1]} `)

  return d
}

export function createOpenCubicSpline(points: Vector2D[], tension = 2): string {
  // Normalize the tension value for better user experience
  const normalizedTension = tension / 10

  // Extra points were added so we trim the spline
  const start = points[1]

  let d = `M ${start[0]},${start[1]} `

  for (let i = 2; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 2]
    const [x1, y1] = points[i - 1]
    const [x2, y2] = points[i]
    const [x3, y3] = points[i + 1]

    const cp1x = x1 + (x2 - x0) * normalizedTension
    const cp1y = y1 + (y2 - y0) * normalizedTension
    const cp2x = x2 - (x3 - x1) * normalizedTension
    const cp2y = y2 - (y3 - y1) * normalizedTension

    const path = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
    d += path
  }

  return d
}
