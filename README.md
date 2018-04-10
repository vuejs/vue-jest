# vue-jest

Jest Vue transformer with source map support

## Usage

```
npm install --save-dev vue-jest
```

## Setup

To define vue-jest as a transformer for your .vue files, you need to map .vue files to the vue-jest module.

```
"transform": {
  ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
},
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

vue-jest compiles the script and template of SFCs into a JavaScript file that Jest can run. **Currently, SCSS and Stylus are the only style languages that are compiled**.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

### Supported template languages

- **pug** (`lang="pug"`)
  - To give options for the Pug compiler, enter them into the Jest configuration.
  The options will be passed to pug.compile().
  ```js
    // package.json
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
- **scss** (`lang="scss"`)
  - To import globally included files (ie. variables, mixins, etc.), include them in the Jest configuration at `jest.globals['vue-jest'].resources.scss`:
  ```js
  // package.json
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

```js
  // package.json
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
