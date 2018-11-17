import findBabelConfig from 'find-babel-config'
import loadBabelConfig from '../lib/load-babel-config'
import { resolve } from 'path'
import {
  createReadStream,
  createWriteStream,
  readFileSync,
  renameSync,
  writeFileSync,
  unlinkSync
} from 'fs'
import clearModule from 'clear-module'
import cache from '../lib/cache'

describe('load-babel-config.js', () => {
  beforeEach(() => {
    cache.flushAll()
    clearModule.all()
  })

  it('returns undefined if there is no .babelrc', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const babelRcPath2 = resolve(__dirname, '../../.babelrc')
    const tempPath = resolve(__dirname, '../.renamed')
    const tempPath2 = resolve(__dirname, '../../.renamed')
    renameSync(babelRcPath, tempPath)
    renameSync(babelRcPath2, tempPath2)
    const babelConfig = loadBabelConfig({})
    try {
      expect(babelConfig).toBe(undefined)
    } catch (err) {
      renameSync(tempPath, babelRcPath)
      renameSync(tempPath2, babelRcPath2)
      throw err
    }
    renameSync(tempPath, babelRcPath)
    renameSync(tempPath2, babelRcPath2)
    const babelConfigCached = loadBabelConfig()
    expect(babelConfigCached).toBe(undefined)
  })

  it('reads default babel if there is .babelrc', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const babelRcCopiedPath = resolve(__dirname, '../.babelrc_cp')
    createReadStream(babelRcPath).pipe(createWriteStream(babelRcCopiedPath))
    const babelRcOriginal = JSON.parse(readFileSync(babelRcPath, { encoding: 'utf8' }))
    const babelConfig = loadBabelConfig({})
    expect(babelConfig).toEqual(babelRcOriginal)
    const tempPath = resolve(__dirname, '../.renamed')
    renameSync(babelRcCopiedPath, tempPath)
    const babelConfigCached = loadBabelConfig()
    try {
      expect(babelConfig).not.toBe(babelConfigCached)
      expect(babelConfig).toEqual(babelConfigCached)
    } catch (err) {
      renameSync(tempPath, babelRcCopiedPath)
      throw err
    }
  })

  it('reads .babelrc if it is below the current working directory', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const babelRcContent = JSON.parse(readFileSync(babelRcPath, { encoding: 'utf8' }))
    process.chdir('test')
    const babelConfig = loadBabelConfig({})
    expect(babelConfig).toEqual(babelRcContent)
    process.chdir('..')
  })

  it('reads .babelrc from the current working directory', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const babelRcContent = JSON.parse(readFileSync(babelRcPath, { encoding: 'utf8' }))
    const newBabelRcPath = resolve(__dirname, '../test/.babelrc')
    const newBabelRcContent = '{"env":{}}'
    process.chdir('test')
    writeFileSync(newBabelRcPath, newBabelRcContent)
    const babelConfig = loadBabelConfig({})
    expect(babelConfig).toEqual(JSON.parse(newBabelRcContent))
    expect(babelConfig).not.toEqual(babelRcContent)
    unlinkSync(newBabelRcPath)
    process.chdir('..')
  })

  it('supports babel.config.js', () => {
    const babelConfigPath = resolve(__dirname, '../babel.config.js')
    const config = {
      plugins: ['foo']
    }
    writeFileSync(babelConfigPath, `module.exports = ${JSON.stringify(config)}`)
    const babelConfig = loadBabelConfig({})
    expect(babelConfig).toEqual(config)
    unlinkSync(babelConfigPath)
  })

  describe('babelConfig option', () => {
    it('supports a path to a babel configuration file', () => {
      const babelConfigPath = resolve(__dirname, '../some-babel-config.js')
      const config = {
        plugins: ['foo']
      }
      writeFileSync(babelConfigPath, `module.exports = ${JSON.stringify(config)}`)
      const babelConfig = loadBabelConfig({
        globals: {
          'vue-jest': {
            babelConfig: babelConfigPath
          }
        }
      })
      expect(babelConfig).toEqual(config)
    })

    it('supports a boolean indicating whether or not to search for babel config', () => {
      const config = {
        plugins: ['foo']
      }
      findBabelConfig.sync = jest.fn(() => ({ file: true, config }))
      const noBabelConfig = loadBabelConfig({
        globals: {
          'vue-jest': {
            babelConfig: false
          }
        }
      })
      expect(findBabelConfig.sync).not.toHaveBeenCalled()
      expect(noBabelConfig).toBeUndefined()

      const babelConfig = loadBabelConfig({
        babelConfig: true
      })
      expect(findBabelConfig.sync).toHaveBeenCalled()
      expect(babelConfig).toEqual(config)
      findBabelConfig.sync.mockRestore()
    })

    it('supports an inline babel configuration object', () => {
      const config = {
        plugins: ['foo']
      }
      const babelConfig = loadBabelConfig({
        globals: {
          'vue-jest': {
            babelConfig: config
          }
        }
      })
      expect(babelConfig).toEqual(config)
    })

    it('defaults to searching for babel config if option is not provided', () => {
      findBabelConfig.sync = jest.fn(() => ({}))
      loadBabelConfig({})
      expect(findBabelConfig.sync).toHaveBeenCalled()
      findBabelConfig.sync.mockRestore()
    })
  })
})
