# vue-jest

Jest transformer for Vue Single File Components.

## Installation

Since we need to support a variety of Vue and Jest versions, vue-jest doesn't follow semantic versioning.

| Vue version | Jest Version      | Package             |
| ----------- | ----------------- | ------------------- |
| Vue 2       | Jest 26 and below | `vue-jest@4`        |
| Vue 3       | Jest 26 and below | `vue-jest@5`        |
| Vue 2       | Jest 27 and above | `@vue/vue2-jest@xx` |
| Vue 3       | Jest 27 and above | `@vue/vue3-jest@xx` |

**xx**: Major version of Jest

```bash
npm install --save-dev @vue/vue2-jest # (use the appropriate version)
yarn add @vue/vue2-jest --dev
```

## Setup

To use `vue-jest` as a transformer for your `.vue` files, map them to the appropriate `vue-jest` module:

```json
{
  "jest": {
    "transform": {
      "^.+\\.vue$": "@vue/vue2-jest" // Update to match your installed version
    }
  }
}
```

A full config will look like this.

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "vue"],
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.vue$": "@vue/vue2-jest"
    }
  }
}
```

### Usage with Babel 7

If you use [jest](https://github.com/facebook/jest) > 24.0.0 and [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest) make sure to install babel-core@bridge

```bash
npm install --save-dev babel-core@bridge
yarn add babel-core@bridge --dev
```

## Supported languages for SFC sections

vue-jest compiles `<script />`, `<template />`, and `<style />` blocks with supported `lang` attributes into JavaScript that Jest can run.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

### Global Jest options

You can change the behavior of `vue-jest` by using `jest.globals`.

#### Compiler Options in Vue 3

These options can be used to define Vue compiler options in `@vue/vue3-jest`.

For example, to enable `propsDestructureTransform`:

```js
globals: {
  'vue-jest': {
    compilerOptions: {
      propsDestructureTransform: true
    }
  }
}
```

or disable `refTransform` (which is enabled by default):

```js
globals: {
  'vue-jest': {
    compilerOptions: {
      refTransform: false
    }
  }
}
```

#### Supporting custom blocks

A great feature of the Vue SFC compiler is that it can support custom blocks. You might want to use those blocks in your tests. To render out custom blocks for testing purposes, you'll need to write a transformer. Once you have your transformer, you'll add an entry to vue-jest's transform map. This is how [vue-i18n's](https://github.com/kazupon/vue-i18n) `<i18n>` custom blocks are supported in unit tests.

A `package.json` Example

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "vue"],
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.vue$": "@vue/vue2-jest"
    },
    "globals": {
      "@vue/vue2-jest": {
        "transform": {
          "your-custom-block": "./custom-block-processor.js"
        }
      }
    }
  }
}
```

> _Tip:_ Need programmatic configuration? Use the [--config](https://jestjs.io/docs/en/cli.html#config-path) option in Jest CLI, and export a `.js` file

A `jest.config.js` Example - If you're using a dedicated configuration file like you can reference and require your processor in the config file instead of using a file reference.

```js
module.exports = {
  globals: {
    '@vue/vue2-jest': {
      transform: {
        'your-custom-block': require('./custom-block-processor')
      }
    }
  }
}
```

#### Writing a processor

Processors must return an object with a "process" method, like so...

```js
module.exports = {
  /**
   * Process the content inside of a custom block and prepare it for execution in a testing environment
   * @param {SFCCustomBlock[]} blocks All of the blocks matching your type, returned from `@vue/component-compiler-utils`
   * @param {string} vueOptionsNamespace The internal namespace for a component's Vue Options in vue-jest
   * @param {string} filename The SFC file being processed
   * @param {Object} config The full Jest config
   * @returns {string} The code to be output after processing all of the blocks matched by this type
   */
  process({ blocks, vueOptionsNamespace, filename, config }) {}
}
```

#### templateCompiler

You can provide [TemplateCompileOptions](https://github.com/vuejs/component-compiler-utils#compiletemplatetemplatecompileoptions-templatecompileresults) in `templateCompiler` section like this:

```json
{
  "jest": {
    "globals": {
      "@vue/vue2-jest": {
        "templateCompiler": {
          "transpileOptions": {
            "transforms": {
              "dangerousTaggedTemplateString": true
            }
          }
        }
      }
    }
  }
}
```

### Supported template languages

- **pug** (`lang="pug"`)

  - To give options for the Pug compiler, enter them into the Jest configuration.
    The options will be passed to pug.compile().

  ```json
  {
    "jest": {
      "globals": {
        "@vue/vue2-jest": {
          "pug": {
            "basedir": "mybasedir"
          }
        }
      }
    }
  }
  ```

- **jade** (`lang="jade"`)
- **haml** (`lang="haml"`)

### Supported style languages

- **stylus** (`lang="stylus"`, `lang="styl"`)
- **sass** (`lang="sass"`), and
- **scss** (`lang="scss"`)

  - The Sass compiler supports Jest's [moduleNameMapper](https://facebook.github.io/jest/docs/en/configuration.html#modulenamemapper-object-string-string) which is the suggested way of dealing with Webpack aliases. Webpack's `sass-loader` uses a [special syntax](https://github.com/webpack-contrib/sass-loader/blob/v9.0.2/README.md#resolving-import-at-rules) for indicating non-relative imports, so you'll likely need to copy this syntax into your `moduleNameMapper` entries if you make use of it. For aliases of bare imports (imports that require node module resolution), the aliased value must also be prepended with this `~` or `vue-jest`'s custom resolver won't recognize it.
    ```json
    {
      "jest": {
        "moduleNameMapper": {
          "^~foo/(.*)": "<rootDir>/foo/$1",
          // @import '~foo'; -> @import 'path/to/project/foo';
          "^~bar/(.*)": "~baz/lib/$1"
          // @import '~bar/qux'; -> @import 'path/to/project/node_modules/baz/lib/qux';
          // Notice how the tilde (~) was needed on the bare import to baz.
        }
      }
    }
    ```
  - To import globally included files (ie. variables, mixins, etc.), include them in the Jest configuration at `jest.globals['vue-jest'].resources.scss`:

    ```json
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

## CSS options

`experimentalCSSCompile`: `Boolean` Default true. Turn off CSS compilation

`hideStyleWarn`: `Boolean` Default false. Hide warnings about CSS compilation

`resources`:

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

## Style options

Possbility to change style loader options (sass, scss, less etc).

`styleOptions`: `Object` Default `{}`.

```json
{
  "jest": {
    "globals": {
      "vue-jest": {
        "styleOptions": {
          "quietDeps" // e.q. sass options https://sass-lang.com/documentation/js-api#quietdeps
          // unfortunately rest options like `data`, `file` doesnt work because @vue/compiler-component-utils internally overwrite options with their values
        },
      }
    }
  }
}
```
