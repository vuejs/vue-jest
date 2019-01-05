# vue-jest

Jest transformer for Vue single file components

## Usage

```bash
npm install --save-dev vue-jest
```

## Setup

To use `vue-jest` as a transformer for your `.vue` files, map them to the `vue-jest` module:

```js
{
  "jest": {
    "transform": {
      "^.+\\.vue$": "vue-jest"
    }
}
```

A full config might look like this:

```js
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "vue"],
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.vue$": "vue-jest"
    }
  }
}
```

## Examples

- [Vue Test Utils with Jest](https://github.com/eddyerburgh/vue-test-utils-jest-example)

## Supported langs

vue-jest compiles `<script />`, `<template />`, and `<style />` blocks with supported `lang` attributes into JavaScript that Jest can run.

### Script languages

- **TypeScript** (`ts`, `typescript`)
- **CoffeeScript** (`coffee`, `coffeescript`)

### Template languages

vue-jest uses [consolidate](https://github.com/tj/consolidate.js/) to compile template languages. See the list of [supported engines](https://github.com/tj/consolidate.js/#supported-template-engines).

_Note: engines that compile asynchronously are not supported_

To pass options to the language compiler, add them to `jest.globals.vue-jest`:

```js
{
  "jest": {
    "globals": {
      "vue-jest": {
        "pug": {
          "basedir": "mybasedir"
        }
      }
    }
  }
}
```

### Style languages

- Stylus (`stylus`, `styl`)
- Sass (`sass`)
  - The SASS compiler supports jest's [moduleNameMapper](https://facebook.github.io/jest/docs/en/configuration.html#modulenamemapper-object-string-string) which is the suggested way of dealing with Webpack aliases.
- SCSS (`scss`)

  - The SCSS compiler supports jest's [moduleNameMapper](https://facebook.github.io/jest/docs/en/configuration.html#modulenamemapper-object-string-string) which is the suggested way of dealing with Webpack aliases.
  - To import globally included files (ie. variables, mixins, etc.), include them in the Jest configuration at `jest.globals['vue-jest'].resources.scss`:

    ```js
    {
      "jest": {
        "globals": {
          "vue-jest": {
            "resources": {
              "scss": [
                "./node_modules/package/_mixins.scss",
                "./src/assets/css/globals.scss"
              ]
            }
          }
        }
      }
    }
    ```

## Configuration

You can configure vue-jest with `jest.globals`.

_Tip: Need programmatic configuration? Use the [--config](https://jestjs.io/docs/en/cli.html#config-path) option in Jest CLI, and export a `.js` file_

### options

`experimentalCSSCompile`: `Boolean` Turn off CSS compilation (default `true`)

`hideStyleWarn`: `Boolean` Hide warnings about CSS compilation (default `false`)

```json
{
  "jest": {
    "globals": {
      "vue-jest": {
        "hideStyleWarn": true,
        "experimentalCSSCompile": true
      }
    }
  }
}
```

### babel options

vue-jest uses babel-jest to resolve babel options.

### tsconfig

vue-jest uses ts-jest to resolve your `tsconfig` file.

If you wish to pass in a custom location for your tsconfig file, use the [ts-jest configuration options](https://kulshekhar.github.io/ts-jest/user/config/#options).
