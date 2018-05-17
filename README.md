# vue-jest

Jest Vue transformer with source map support

## Usage

```bash
npm install --save-dev vue-jest
```

## Setup

To define vue-jest as a transformer for your .vue files, you need to map .vue files to the vue-jest module.

```json
{
  "jest": {
    "transform": {
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    }
}
```

A full config will look like this.

```json
{
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "vue"
    ],
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    }
  }
}
```

If you're on a version of Jest older than 22.4.0, you need to set `mapCoverage` to `true` in order to use source maps.

## Example Projects

Example repositories testing Vue components with jest and vue-jest:

- [Avoriaz with Jest](https://github.com/eddyerburgh/avoriaz-jest-example)
- [Vue Test Utils with Jest](https://github.com/eddyerburgh/vue-test-utils-jest-example)

## Supported langs

vue-jest compiles the script and template of SFCs into a JavaScript file that Jest can run. **Currently, SCSS, SASS and Stylus are the only style languages that are compiled**.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

To define a tsconfig file that vue-jest will use when transpiling typescript, you can specify it in the jest globals

```json
{
  "jest": {
    "globals": {
      "vue-jest": {
        "tsConfigFile": "tsconfig.jest.json"
      }
    }
  }
}
```

To define a babelrc file that vue-jest will use when transpiling javascript, you can specify it in the jest globals

```json
{
  "jest": {
    "globals": {
      "vue-jest": {
        "babelRcFile": "jest.babelrc"
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
          "vue-jest": {
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
