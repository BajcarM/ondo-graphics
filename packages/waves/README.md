# Fluid SVG

Create fluidly moving or animating SVG elements for modern websites with ease.

## Introduction

Fluid-Motion is an npm package that provides a set of functions and components to create smooth and seamless animations for SVG elements. While there are many options available for static SVG shapes, there are few solutions that allow you to achieve fluid and dynamic motion. This package aims to fill that gap, making it easy to bring life to your SVG graphics on any modern website.

## Features

- **Fluid Motion Functions**: The package includes a variety of functions that enable you to create smooth, fluid animations for SVG elements. These functions can be used standalone or combined to achieve complex motion effects.

- **Framework Support**: Fluid-Motion is designed to be compatible with popular frameworks such as Vanilla JS, React, Vue, and more. It provides dedicated components tailored to each framework, allowing you to seamlessly integrate fluid motion into your projects.

- **Written in TypeScript**: The entire package is written in TypeScript, ensuring strong typing and enhancing the development experience. TypeScript support enables autocompletion, type checking, and improved code documentation.

## Installation

To install Fluid-Motion, simply run the following command:

```bash
npm i @fluid-svg/functions
```

## Usage

Here's a basic example of how you can use the Fluid-Motion package in your project:

```html
<!-- Add simple HTML markup -->
<svg id="MySvg" height="500" width="500" xmlns="http://www.w3.org/2000/svg">
  <path stroke="blue" strokeWidth="0.005" />
  <path stroke="red" strokeWidth="0.005" />
  <path stroke="green" strokeWidth="0.005" />
</svg>
```

```javascript
import { animateWaves } from '@fluid-svg/functions'

// Animate an SVG element
animateWaves('#MySvg')
```

For more detailed usage instructions and examples, refer to the documentation provided in the docs directory.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request. For more information on how to contribute, check out the Contribution Guidelines.

## License

Fluid-Motion is licensed under the MIT License. See the LICENSE file for more details.
