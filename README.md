# vue-jest

Jest Vue transformer for Vue 3.

## Usage

```bash
npm install --save-dev vue-jest
yarn add --dev vue-jest
```

## Setup

To define `vue-jest` as a transformer for your `.vue` files, map them to the `vue-jest` module:

```json
{
  "jest": {
    "transform": {
      "^.+\\.vue$": "vue-jest"
    }
}
```

## Example Projects

Example repositories testing Vue 3 components with jest and vue-jest:

TODO: Examples

## Supported langs

vue-jest compiles the script and template of SFCs into a JavaScript file that Jest can run.

### Supported script languages

- **typescript** (`lang="ts"`, `lang="typescript"`)
- **coffeescript** (`lang="coffee"`, `lang="coffeescript"`)


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

### Global Jest options

You can change the behavior of `vue-jest` by using `jest.globals`.

### TODO:

- Style support
- Custom blocks
- Global config
