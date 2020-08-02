// Inspired by
// https://github.com/facebook/jest/blob/v26.0.0/scripts/mapCoverage.js

const { resolve } = require('path')
const { sync: glob } = require('glob')
const { createCoverageMap } = require('istanbul-lib-coverage')
const { createContext } = require('istanbul-lib-report')
const istanbulReports = require('istanbul-reports')

const pattern = resolve(__dirname, './__projects__/*/.nyc_output/*.json')
const map = createCoverageMap()

glob(pattern).forEach(path => {
  map.merge(require(path))
})

const context = createContext({ coverageMap: map })
;['html', 'text'].forEach(reporter =>
  istanbulReports.create(reporter, {}).execute(context)
)
