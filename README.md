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
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    },
    "mapCoverage": true
  }
}
```

## Example Projects

Example repositories testing Vue components with jest and vue-jest:

- [Avoriaz with Jest](https://github.com/eddyerburgh/avoriaz-jest-example)
- [Vue Test Utils with Jest](https://github.com/eddyerburgh/vue-test-utils-jest-example)

## Supported langs

vue-jest compiles the script and template of SFCs into a JavaScript file that Jest can run. **It does not currently compile the style section**.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)

### Supported template languages

- **pug** (`lang="pug"`)
- **jade** (`lang="jade"`)
- **haml** (`lang="haml"`)
