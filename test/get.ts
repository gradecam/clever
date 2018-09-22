import {createInstance} from '../src';

const instance = createInstance();

test('an ID is required', async () => {
  expect.assertions(1);
  expect(() => {
    instance.districts.get('');
  }).toThrowError(/^must specify an ID$/);
});

test('can get by ID', async () => {
  const doc = await instance.districts.get('4fd43cc56d11340000000005');
  expect(doc.name).toEqual('Demo District');
});

test('can retrieve related document', async () => {
  const sections = await instance.sections.list({params: {limit: 1}});
  expect(sections.data.length).toEqual(1);
  const section = sections.data[0].data;
  expect(section).toBeTruthy();
  const district = await instance.sections.district(section.id);
  expect(district.name).toEqual('Demo District');
});
