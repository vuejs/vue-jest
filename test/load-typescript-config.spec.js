import { defaultConfig, loadTypescriptConfig } from '../lib/load-typescript-config'
import { resolve } from 'path'
import {
  createReadStream,
  createWriteStream,
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync
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

  it('returns the tsconfig specified in jest globals', () => {
    const jestGlobalTsConfigPath = resolve(__dirname, '../tsconfig.jest.json')

    writeFileSync(jestGlobalTsConfigPath, JSON.stringify({
      allowJs: false
    }))

    const jestGlobalTsConfig = JSON.parse(readFileSync(jestGlobalTsConfigPath, { encoding: 'utf8' }))

    const tsconfig = loadTypescriptConfig({
      tsConfigFile: jestGlobalTsConfigPath
    })

    expect(tsconfig).toEqual(jestGlobalTsConfig)

    unlinkSync(jestGlobalTsConfigPath)
  })

  it('reads default tsconfig if there is tsconfig.json', () => {
    const tsconfigPath = resolve(__dirname, '../tsconfig.json')
    const tsconfigCopiedPath = resolve(__dirname, '../.tsconfig.json_cp')
    createReadStream(tsconfigPath).pipe(createWriteStream(tsconfigCopiedPath))
    const tsconfigOriginal = JSON.parse(readFileSync(tsconfigPath, { encoding: 'utf8' }))
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
})
