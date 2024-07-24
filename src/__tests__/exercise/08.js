// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {renderHook, act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

function Counter()
{
  const {count, increment, decrement} = useCounter();
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}

// function setup({initialProps} = {}) {
//   const result = {};
//   function TestComponent() {
//     result.current = useCounter(initialProps);
//     return null;
//   }

//   render(<TestComponent />);
//   return result;
// }

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
// 💰 here's how to use the hook:
// const {count, increment, decrement} = useCounter()

test('exposes the count and increment/decrement functions', async () => {
  render(<Counter />)
  const count = screen.getByText(/count:/i);
  const increment = screen.getByRole('button', {name: /increment/i});
  const decrement = screen.getByRole('button', {name: /decrement/i});

  expect(count).toHaveTextContent('Count: 0');
  await userEvent.click(increment);
  expect(count).toHaveTextContent('Count: 1');

  await userEvent.click(decrement);
  expect(count).toHaveTextContent('Count: 0');
})

test('exposes the count and increment/decrement functions 2', () => {
  let { result } = renderHook(useCounter);

  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
})

test('allow customization of initial count', () => {
  let {result} = renderHook(useCounter, { initialProps: {initialCount: 3} });

  expect(result.current.count).toBe(3);
  act(() => result.current.increment());
  expect(result.current.count).toBe(4);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(3);
})

test('allow customization of initial step', () => {
  let result = renderHook(useCounter, { initialProps: {step: 2} }).result;

  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(2);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
})

test('step can be changed', () => {
  let {result, rerender} = renderHook(useCounter, { initialProps: {step: 2} });

  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(2);

  rerender({step: 2});
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
})

/* eslint no-unused-vars:0 */
