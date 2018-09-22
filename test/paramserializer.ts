import {paramsSerializer} from '../src';

test('serializes parameters properly', async () => {
  const value = ['one', 'two', 'three'];
  const params = paramsSerializer({value});
  expect(params).toEqual(value.map(val => `value=${val}`).join('&'));
});

test('should not blow up when params are undefined', async () => {
  const params = paramsSerializer(void 0);
  expect(params).toEqual('');
});
