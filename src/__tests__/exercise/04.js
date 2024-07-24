// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import {expect, jest, test} from '@jest/globals';
import { build, fake } from '@jackfranklin/test-data-bot';

test('submitting the form calls onSubmit with username and password', async () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  let submittedData = null;

  // const handleSubmit = (data) => (submittedData = data);

  const handleSubmit = jest.fn();

  // accepts the data and assigns submittedData to the data that was submitted
  // 💰 if you need a hand, here's what the handleSubmit function should do:
  // const handleSubmit = data => (submittedData = data)
  //
  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  
  const buildLoginForm = build({
    fields: {
      userNameText: fake(f => f.internet.userName()),
      passwordText: fake(f => f.internet.password())
    }
  })
  
  // function buildLoginForm(overrides) {
  //   return {
  //     username: faker.internet.userName(),
  //     password: faker.internet.password(),
  //     ...overrides,
  //   }
  // }
  

  render(<Login onSubmit={handleSubmit} />);
  
  // let overridesUsername = 'test';
  // const { userNameText, passwordText } = buildLoginForm({ fields : { userNameText: overridesUsername  }});
  const { userNameText, passwordText } = buildLoginForm();
  const username = screen.getByLabelText(/username/i);
  const password = screen.getByLabelText(/password/i);
  await userEvent.type(username, userNameText);
  await userEvent.type(password, passwordText);

  console.log('userNameText', userNameText);
  //screen.debug();
  // 🐨 get the username and password fields via `getByLabelText`
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you wantw
  //
  // 🐨 click on the button with the text "Submit"
  const submit = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(submit);

  let expectedData = {
    username: userNameText,
    password: passwordText,
  };
  // expect(submittedData).toEqual();

  // expect(overridesUsername).toEqual(userNameText);
  expect(handleSubmit).toHaveBeenCalledWith(expectedData);
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  //
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
})

/*
eslint
  no-unused-vars: "off",
*/
