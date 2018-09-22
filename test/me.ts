import {createInstance} from '../src';

const instance = createInstance();

test('able to retrieve details about the owner of the access token', async () => {
  const resp = await instance.me();
  expect(resp.data).toBeTruthy();
  expect(Array.isArray(resp.links)).toBeTruthy();
});
