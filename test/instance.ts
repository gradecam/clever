import {createInstance} from '../src';

test('throws an error if you try to instantiate without a token', () => {
  expect.assertions(1);
  expect(() => {
    createInstance({token: ''});
  }).toThrowError(/^A token is required.$/);
});
