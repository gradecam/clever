import {Readable} from 'stream';

import {createInstance} from '../src';
import {LIMIT_MAX} from '../src/apis';

const instance = createInstance();

test('list with no arguments', async () => {
  const promise = instance.districts.list();
  expect(typeof promise.then).toEqual('function');
  const result = await promise;
  expect(Array.isArray(result.data)).toBeTruthy();
  expect(Array.isArray(result.links)).toBeTruthy();
  result.data.forEach(doc => {
    expect(doc.data.name).toEqual('Demo District');
  });
});

test('list without {stream: true} in params returns a promise', async () => {
  const noOpts = instance.districts.list();
  const onlyParams = instance.districts.list({params: {}});
  const streamFalse = instance.districts.list({stream: false});
  expect(noOpts).toBeInstanceOf(Promise);
  expect(onlyParams).toBeInstanceOf(Promise);
  expect(streamFalse).toBeInstanceOf(Promise);
});

test('list with {string: true} in `params` returns a `stream`', async () => {
  const noParams = instance.districts.list({stream: true});
  const withParams = instance.districts.list({params: {}, stream: true});
  expect(noParams).toBeInstanceOf(Readable);
  expect(withParams).toBeInstanceOf(Readable);
});

test('lists of related documents requires an ID', async () => {
  expect.assertions(1);
  expect(() => {
    instance.sections.teachers('');
  }).toThrowError(/^must specify an ID$/);
});

test('id must be of type string', async () => {
  const sections = await instance.sections.list({params: {limit: 1}});
  expect(sections.data.length).toEqual(1);
  const section = sections.data[0].data;
  expect(section).toBeTruthy();
  expect(() => {
    const id: any = {id: section.id};  // tslint:disable-line
    instance.sections.teachers(id, {params: {limit: 1}});
  }).toThrowError(/^must specify an ID$/);
});

test('lists of related documents can be streamed', async () => {
  const stream = instance.sections.teachers('1', {stream: true});
  expect(stream).toBeInstanceOf(Readable);
});

test('list of related documents can be returned by a promise', async () => {
  const sections = await instance.sections.list({params: {limit: 1}});
  expect(sections.data.length).toEqual(1);
  const section = sections.data[0].data;
  expect(section).toBeTruthy();
  const teachers = await instance.sections.teachers(section.id, {params: {limit: 1}});
  expect(Array.isArray(teachers.data)).toBeTruthy();
});

test('rejects limit < 1', async () => {
  expect(() => {
    const params: any = {limit: 0};  // tslint:disable-line
    instance.sections.list({params});
  }).toThrowError(/^limit must be >= 1$/);
});

test('rejects limit > `LIMIT_MAX`', async () => {
  expect(() => {
    const params: any = {limit: LIMIT_MAX + 1};  // tslint:disable-line
    instance.sections.list({params});
  }).toThrowError(`limit must be <= ${LIMIT_MAX}`);
});

test('rejects limit of type other than number', async () => {
  expect(() => {
    const params: any = {limit: 'not a number'};  // tslint:disable-line
    instance.sections.list({params});
  }).toThrowError(/^limit must be a number$/);
});
