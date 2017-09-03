# jest-vue

Jest Vue transformer with source map support

## Usage

```
npm install --save-dev jest-vue
```

## Setup

Note: this step is only required if you are using babel-jest with additional code preprocessors.

To define jest-vue as a transformer for your .vue code, map .vue files to the babel-jest module.

```
"transform": {
  ".*\\.(vue)$": "<rootDir>/node_modules/jest-vue"
},
```

To use source maps, you need to set `mapCoverage` to `true`. A full config will look like this.

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
      ".*\\.(vue)$": "<rootDir>/jest-vue.js"
    },
    "mapCoverage": true
  }
}
```

## Example Projects

Example repositories testing Vue components with jest and jest-vue:

- [Avoriaz with Jest](https://github.com/eddyerburgh/avoriaz-jest-example)
- [Vue Test Utils with Jest](https://github.com/eddyerburgh/vue-test-utils-jest-example)

## Supported langs

jest-vue compiles the script and template of SFCs into a JavaScript file that Jest can run. **It does not currently compile the style section**.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

### Supported template languages

- **pug** (`lang="pug"`)
- **jade** (`lang="jade"`)
