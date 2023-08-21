import { WavesComponentOptions } from '.'
import { ForwardedRef, HTMLAttributes } from 'react'

export type {
  FillOptions,
  LinearGradientOptions,
  StrokeOptions,
  WaveOptions,
  WavesComponentOptions,
} from '../../waves/src/types'

/**
 * Helper for converting camel case to kebab case
 */
type Kebab<
  T extends string,
  A extends string = '',
> = T extends `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
  : A

/**
 * Helper for converting object keys to kebab case and values to strings
 */
type KeysToKebabAndValuesToString<T> = {
  [key in keyof T as Kebab<key & string>]: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'og-waves': WaveComponentAttributes
    }

    interface WaveComponentAttributes
      extends KeysToKebabAndValuesToString<WavesComponentOptions>,
        HTMLAttributes<HTMLElement> {}
  }
}

type WavesProps = WavesComponentOptions & HTMLAttributes<HTMLElement>

export type OGWavesPropsWithRef = WavesProps & {
  ref?: ForwardedRef<HTMLElement> | undefined
}
