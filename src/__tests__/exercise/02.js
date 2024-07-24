// simple test with React Testing Library
// http://localhost:3000/counter

import * as React from 'react'
import {act} from 'react-dom/test-utils'
import {createRoot} from 'react-dom/client'
import {render, fireEvent} from '@testing-library/react'
import Counter from '../../components/counter'

test('counter increments and decrements when the buttons are clicked', () => {
  // 💣 remove these two lines, React Testing Library will create the div for you
  const div = document.createElement('div')
  document.body.append(div)

  const {container} = render(<Counter />);

  const [decrement, increment] = container.querySelectorAll('button');
  const message = container.firstChild.querySelector('div');

  expect(message).toHaveTextContent('Current count: 0');
  fireEvent.click(increment);
  expect(message).toHaveTextContent('Current count: 1');
  fireEvent.click(decrement);
  expect(message).toHaveTextContent('Current count: 0');
})
