import { getTSConfig } from '../lib/utils'
import { resolve } from 'path'
import ts from 'typescript'

describe('tsconfig options', () => {
  test('should extend the tsconfig when extends options is used', () => {
    const { compilerOptions } = getTSConfig()
    expect(compilerOptions.strictNullChecks).toBeTruthy()
    expect(compilerOptions.module).toBe(ts.ModuleKind.ES2015)
  })

  test('should read tsconfig from root when not assigned', () => {
    const { compilerOptions } = getTSConfig()
    expect(compilerOptions.strictNullChecks).toBeTruthy()
    expect(compilerOptions.module).toBe(ts.ModuleKind.ES2015)
  })

  test('should read from tsConfig object when specified in vue-jest config', () => {
    const { compilerOptions } = getTSConfig({
      globals: {
        'vue-jest': {
          tsConfig: {
            compilerOptions: {
              target: 'ES2016'
            }
          }
        }
      }
    })
    expect(compilerOptions.target).toBe(ts.ScriptTarget[ts.ScriptTarget.ES2016])
  })

  test('should read user configured file path when specified in vue-jest config', () => {
    const { compilerOptions } = getTSConfig({
      globals: {
        'vue-jest': {
          tsConfig: resolve(__dirname, '../__mocks__/config/base-tsconfig.json')
        }
      }
    })
    expect(compilerOptions.module).toBe(ts.ModuleKind.ES2015)
    expect(compilerOptions.moduleResolution).toBeUndefined()
  })
})
