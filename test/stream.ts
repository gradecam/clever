import {createInstance} from '../src';

const TIMEOUT = 50000;

test('handles paging correctly', async () => {
  const count = {
    expected: 0,
    stream: 0,
    requests: 0,
  };
  const instance = createInstance();
  const LIMIT = 5000;
  const resp = await instance.teachers.list({params: {limit: LIMIT}});
  count.expected = resp.data.length;
  expect(count.expected).toBeGreaterThan(0);
  expect(count.expected).toBeLessThan(LIMIT);
  return new Promise((resolve) => {
    const stream = instance.teachers.list({params: {limit: 10}, stream: true});
    stream.on('request', () => {
      count.requests++;
    });
    stream.on('data', (doc) => {
      count.stream++;
    });
    stream.on('end', () => {
      // verify `end` event wasn't emitted prior to all of
      // the data being emitted.
      expect(count.stream).toEqual(count.expected);
      // verify that multiple pages of data were retrieved
      expect(count.requests).toBeGreaterThan(1);
      resolve(count);
    });
    stream.on('error', (err) => {
      // We shouldn't have encountered an error
      console.error(err);
      expect(err).toBeFalsy();
    });
  });
}, TIMEOUT);

test('handles errors correctly', async () => {
  const instance = createInstance({token: 'INVALID_TOKEN'});
  expect.assertions(2);
  return new Promise((resolve) => {
    const stream = instance.teachers.list({params: {limit: 10}, stream: true});
    stream.on('data', (doc) => {
      fail(doc);
    });
    stream.on('error', (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual('Request failed with status code 401');
    });
    stream.on('end', () => {
      resolve();
    });
  });
}, TIMEOUT);
