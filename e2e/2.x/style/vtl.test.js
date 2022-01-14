import { render } from '@testing-library/vue'
import ScssVTL from './components/ScssVTL'
import SassVTL from './components/SassVTL'

test('processes Sass', () => {
  render(SassVTL)

  const elementBackgroundColor = window.getComputedStyle(
    document.querySelector('.test')
  ).backgroundColor
  expect(elementBackgroundColor).toEqual('blue')
})

test('processes Scss', () => {
  render(ScssVTL)

  const elementBackgroundColor = window.getComputedStyle(
    document.querySelector('.test')
  ).backgroundColor
  expect(elementBackgroundColor).toEqual('blue')
})
