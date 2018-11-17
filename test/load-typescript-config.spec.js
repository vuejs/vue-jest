import tsc from 'tsconfig'
import {
  defaultConfig,
  loadTypescriptConfig
} from '../lib/load-typescript-config'
import { resolve } from 'path'
import {
  createReadStream,
  createWriteStream,
  readFileSync,
  writeFileSync,
  renameSync
} from 'fs'
import clearModule from 'clear-module'
import cache from '../lib/cache'

describe('load-typescript-config.js', () => {
  beforeEach(() => {
    cache.flushAll()
    clearModule.all()
  })

  it('returns the default config if there is no tsconfig.json', () => {
    const tsconfigPath = resolve(__dirname, '../tsconfig.json')
    const tempPath = resolve(__dirname, '../.renamed')
    renameSync(tsconfigPath, tempPath)

    const tsConfig = loadTypescriptConfig({})

    try {
      expect(tsConfig).toEqual(defaultConfig)
    } catch (err) {
      renameSync(tempPath, tsconfigPath)
      throw err
    }

    renameSync(tempPath, tsconfigPath)
    const tsconfigCachedConfig = loadTypescriptConfig()
    expect(tsconfigCachedConfig).toEqual(defaultConfig)
  })

  it('reads default tsconfig if there is tsconfig.json', () => {
    const tsconfigPath = resolve(__dirname, '../tsconfig.json')
    const tsconfigCopiedPath = resolve(__dirname, '../.tsconfig.json_cp')
    createReadStream(tsconfigPath).pipe(createWriteStream(tsconfigCopiedPath))
    const tsconfigOriginal = JSON.parse(
      readFileSync(tsconfigPath, { encoding: 'utf8' })
    )
    const tsconfig = loadTypescriptConfig({})
    expect(tsconfig).toEqual(tsconfigOriginal)
    const tempPath = resolve(__dirname, '../.renamed')
    renameSync(tsconfigCopiedPath, tempPath)
    const tsconfigCached = loadTypescriptConfig({})
    try {
      expect(tsconfig).not.toBe(tsconfigCached)
      expect(tsconfig).toEqual(tsconfigCached)
    } catch (err) {
      renameSync(tempPath, tsconfigCopiedPath)
      throw err
    }
  })

  describe('tsConfig option', () => {
    it('supports a path to a ts configuration file', () => {
      const tsConfigPath = resolve(__dirname, '../some-ts-config.json')
      const config = {
        importHelpers: true
      }
      writeFileSync(tsConfigPath, JSON.stringify(config))
      const tsConfig = loadTypescriptConfig({
        globals: {
          'vue-jest': {
            tsConfig: tsConfigPath
          }
        }
      })
      expect(tsConfig).toEqual(config)
    })

    it('supports a boolean "true" indicating to search for ts config', () => {
      const config = {
        importHelpers: true
      }
      tsc.loadSync = jest.fn(() => ({ path: true, config }))
      const tsConfig = loadTypescriptConfig({
        globals: {
          'vue-jest': {
            tsConfig: true
          }
        }
      })
      expect(tsc.loadSync).toHaveBeenCalled()
      expect(tsConfig).toEqual(config)
      tsc.loadSync.mockRestore()
    })

    it('supports a boolean "false" indicating to use the default ts config options', () => {
      const config = {
        importHelpers: true
      }
      tsc.loadSync = jest.fn(() => ({ path: true, config }))
      const defaultTsConfig = loadTypescriptConfig({
        globals: {
          'vue-jest': {
            tsConfig: false
          }
        }
      })
      expect(tsc.loadSync).not.toHaveBeenCalled()
      expect(defaultTsConfig).toEqual(defaultConfig)
    })

    it('supports an inline ts configuration object', () => {
      const config = {
        importHelpers: true
      }
      const tsConfig = loadTypescriptConfig({
        tsConfig: config
      })
      expect(tsConfig).toEqual(config)
    })

    it('defaults to searching for ts config if option is not provided', () => {
      tsc.loadSync = jest.fn(() => ({}))
      loadTypescriptConfig({})
      expect(tsc.loadSync).toHaveBeenCalled()
      tsc.loadSync.mockRestore()
    })
  })
})
