import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Student api definition
 */
export interface Student extends Api<Schema.Student> {
  contacts: IdListApi<Schema.Contact>;
  district: ItemApi<Schema.District>;
  school: ItemApi<Schema.School>;
  schools: IdListApi<Schema.School>;
  sections: IdListApi<Schema.Section>;
  teachers: IdListApi<Schema.Teacher>;
}

/**
 * Creates a Student api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Student {
  const path = '/v2.0/students';
  const extraApis = {
    contacts: listApi<Schema.Contact>(client, path, {resource: 'contacts'}),
    district: itemApi<Schema.District>(client, path, 'district'),
    school: itemApi<Schema.School>(client, path, 'school'),
    schools: listApi<Schema.School>(client, path, {resource: 'schools'}),
    sections: listApi<Schema.Section>(client, path, {resource: 'sections'}),
    teachers: listApi<Schema.Teacher>(client, path, {resource: 'teachers'}),
  };
  const resource = createApi<Schema.Student, Student>(client, path, extraApis);
  return resource;
}
