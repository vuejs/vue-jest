import { randomExport } from './resources/NamedExport.vue'

describe('NamedExport', () => {
  it('exports named export "randomExport"', () => {
    expect(randomExport).toEqual(42)
  })
})
