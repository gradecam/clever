import MockAdapter from 'axios-mock-adapter';
import {createInstance, rateLimited, resetLimitHeader} from '../src';

const TIMEOUT = 5000;

test('retries request if ratelimit exceeded', async () => {
  const instance = createInstance();
  const mock = new MockAdapter(instance.client);
  mock.onGet().replyOnce(429, void 0, {[resetLimitHeader]: `${(Date.now() / 1000) + 2}`});
  const id = '4fd43cc56d11340000000005';
  const data = await instance.districts.get(id);
  expect(data).toBeTruthy();
  expect(data.name).toEqual('Demo District');
  expect(rateLimited).toEqual(1);
}, TIMEOUT);
