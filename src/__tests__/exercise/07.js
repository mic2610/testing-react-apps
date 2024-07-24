// testing with context and a custom render method
// 💯 create a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
// import {screen} from '@testing-library/react'
// import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'
import * as TestUtils from '../../test/test-utils'

// function renderWithProviders(ui, {theme = 'light', ...options} = {}) {
//   const Wrapper = ({children}) => (
//     <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
//   )
//   return TestUtils.render(ui, {wrapper: Wrapper, ...options})
// }

test('renders with the light styles for the light theme', () => {
  TestUtils.render(<EasyButton>Easy</EasyButton>)
  const button = TestUtils.screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with the dark styles for the dark theme', () => {
  TestUtils.render(<EasyButton>Easy</EasyButton>, {
    theme: 'dark',
  })
  const button = TestUtils.screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})
