import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Section api definition
 */
export interface Section extends Api<Schema.Section> {
  course: ItemApi<Schema.Course>;
  district: ItemApi<Schema.District>;
  school: ItemApi<Schema.School>;
  students: IdListApi<Schema.Student>;
  teacher: ItemApi<Schema.Teacher>;
  teachers: IdListApi<Schema.Teacher>;
  term: ItemApi<Schema.Term>;
}

/**
 * Creates a Section api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Section {
  const path = '/v2.0/sections';
  const extraApis = {
    course: itemApi<Schema.Course>(client, path, 'course'),
    district: itemApi<Schema.District>(client, path, 'district'),
    school: itemApi<Schema.School>(client, path, 'school'),
    students: listApi<Schema.Student>(client, path, {resource: 'students'}),
    teacher: itemApi<Schema.Teacher>(client, path, 'teacher'),
    teachers: listApi<Schema.Teacher>(client, path, {resource: 'teachers'}),
    term: itemApi<Schema.Term>(client, path, 'term'),
  };
  const resource = createApi<Schema.Section, Section>(client, path, extraApis);
  return resource;
}
