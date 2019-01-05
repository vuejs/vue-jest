# vue-jest

Jest transformer for Vue single file components

## Usage

```bash
npm install --save-dev vue-jest
```

## Setup

To define `vue-jest` as a transformer for your `.vue` files, map them to the `vue-jest` module:

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

vue-jest compiles the script and template of SFCs into a JavaScript file that Jest can run.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

### Supported template languages

vue-jest uses [consolidate](https://github.com/tj/consolidate.js/) to compile template languages. See the list of [supported engines](https://github.com/tj/consolidate.js/#supported-template-engines).

_Note: engines that compile asynchronously are not supported_

To pass options to the language compiler, add them to the `vue-jest` options:

```json
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

### Supported style languages

- **stylus** (`lang="stylus"`, `lang="styl"`)
- **sass** (`lang="sass"`)
  - The SASS compiler supports jest's [moduleNameMapper](https://facebook.github.io/jest/docs/en/configuration.html#modulenamemapper-object-string-string) which is the suggested way of dealing with Webpack aliases.
- **scss** (`lang="scss"`)

  - The SCSS compiler supports jest's [moduleNameMapper](https://facebook.github.io/jest/docs/en/configuration.html#modulenamemapper-object-string-string) which is the suggested way of dealing with Webpack aliases.
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

## Configuration

You can change the behavior of `vue-jest` by using `jest.globals`.

> _Tip:_ Need programmatic configuration? Use the [--config](https://jestjs.io/docs/en/cli.html#config-path) option in Jest CLI, and export a `.js` file

`experimentalCSSCompile`: `Boolean` Default true. Turn off CSS compilation

`hideStyleWarn`: `Boolean` Default false. Hide warnings about CSS compilation

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
