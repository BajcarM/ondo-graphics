# ondo-graphics

Create fluidly moving assets for modern websites with ease.

In the world of web design, static shapes are plenty, but achieving fluid and dynamic motion often requires specialized solutions. This package aims to bridge that gap, making it effortless to infuse vitality into any modern website.

## Features

- **Zero Dependency**: The package includes everything needed to function, eliminating concerns about additional dependencies.
- **Compact Size**: At around 10kb gzipped, it ensures optimal website performance.
- **Framework Compatibility**: Engineered to seamlessly integrate with popular frameworks including Vanilla JS, React, Vue, Svelte, and more. It offers dedicated components tailored to each framework.
- **TypeScript-based**: The entire package is crafted using TypeScript, enhancing type safety and developer experience.

## Installation

```shell
$ npm i @ondo-graphics/waves-react
```

## Usage

Customize your coponent using the [configurator](https://www.ondo.graphics/). Then, integrate the generated code snippet into your markup:

```jsx
import { OGWaves } from '@ondo-graphics/waves-react'

const options = {
  background: {
    fill: {
      color: 'rgba(0, 0, 0, 1)',
    },
  },
  distribution: [2, 8],
  amplitude: 1,
  speed: 2,
  complexity: 1,
  synchronicity: 7,
  waves: [
    {
      fill: {
        color: 'rgba(233, 255, 0, 1)',
      },
    },
    {
      fill: {
        color: 'rgba(0, 0, 0, 1)',
      },
    },
  ],
}

const Component = () => <OGWaves {...options} />
```

## Contributing

Contributions are highly appreciated! Should you encounter any issues or have suggestions for enhancements, please don't hesitate to reach out.

## Support

Creating and maintaining this project requires substantial effort. If you find it valuable, consider showing your support by buying me a coffee.

[<a href="https://www.buymeacoffee.com/bajcarmx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="48" width="174"></a>](https://www.buymeacoffee.com/bajcarmx)

## License

Ondo-Graphics is licensed under the MIT License.
