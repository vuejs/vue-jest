import { getTSConfig } from 'vue-jest/lib/utils'
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

  test('should read tsconfig from ts-jest when used in jest config', () => {
    const { compilerOptions } = getTSConfig({
      globals: {
        'ts-jest': {
          tsConfig: './tsconfig.json'
        }
      }
    })
    expect(compilerOptions.outDir).toBe('$$ts-jest$$')
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
          tsConfig: './config/base-tsconfig.json'
        }
      }
    })
    expect(compilerOptions.module).toBe(ts.ModuleKind.ES2015)
    expect(compilerOptions.moduleResolution).toBeUndefined()
  })
})
