// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'
import {handlers} from '../../test/server-handlers'
import {rest} from 'msw'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(...handlers)

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/

// 🐨 before all the tests, start the server with `server.listen()`
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
// 🐨 after all the tests, stop the server with `server.close()`

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  screen.debug()
  expect(screen.getByText(username)).toBeInTheDocument()

  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
})

test(`logging in with no user's username returns UI error`, async () => {
  render(<Login />)
  const {password} = buildLoginForm()

  //await userEvent.type(screen.getByLabelText(/username/i), null)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  screen.debug()

  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <div
      role="alert"
      style="color: red;"
    >
      username required
    </div>
  `)
})


test('unknown server error displays an error message', async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})

test('server returns 404 not found when username not supplied', async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  // server.use(
  //   rest.post(
  //     'https://auth-provider.example.com/api/login',
  //     async (req, res, ctx) => {
  //       return res(ctx.status(500), ctx.json({message: testErrorMessage}))
  //     },
  //   ),
  // );

  const response = await fetch('https://auth-provider.example.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: null,
      password: 'password'
    }),
  })

  render(<Login />)
  expect(response.status).toBe(400);
  expect(response.statusText).toBe('Bad Request');

  expect(await response.json()).toEqual({message: 'username required'});
})