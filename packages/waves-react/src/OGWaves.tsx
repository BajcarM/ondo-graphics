import { forwardRef } from 'react'
import { OGWavesPropsWithRef } from './types'

/**
 * Helper for dynamic loading web component on the client
 */
async function loadOnClient() {
  try {
    const { registerWavesComponent } = await import('@ondo-graphics/waves')
    registerWavesComponent()
  } catch (error) {
    // Handle any errors that occur during the import or registration
    console.error('Error:', error)
  }
}

if (typeof window !== 'undefined') {
  loadOnClient()
}

export const OGWaves = forwardRef<HTMLElement, OGWavesPropsWithRef>(
  (
    {
      background,
      distribution,
      speed,
      complexity,
      synchronicity,
      amplitude,
      waves,
      ...props
    },
    ref,
  ) => (
    <og-waves
      background={JSON.stringify(background)}
      distribution={JSON.stringify(distribution)}
      speed={JSON.stringify(speed)}
      complexity={JSON.stringify(complexity)}
      synchronicity={JSON.stringify(synchronicity)}
      amplitude={JSON.stringify(amplitude)}
      waves={JSON.stringify(waves)}
      ref={ref}
      {...props}
    ></og-waves>
  ),
)

OGWaves.displayName = 'OGWaves'
