import chalk from 'chalk'
import { replace } from '../lib/deprecate'
import logger from '../lib/logger'

describe('display deprecation messaging', () => {
  it('should format the warning with the correct information', () => {
    logger.warn = jest.fn()
    replace('foo', 'bar')
    expect(logger.warn).toHaveBeenCalledWith(chalk.bold.yellow('Deprecation Warning:'), '\n')
    expect(logger.warn).toHaveBeenCalledWith(chalk.yellow(`Option ${chalk.bold('"foo"')} has been removed, and replaced by ${chalk.bold('"bar"')}`), '\n')
    logger.warn.mockRestore()
  })
})
