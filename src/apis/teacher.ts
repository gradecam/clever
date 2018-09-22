import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Teacher api definition
 */
export interface Teacher extends Api<Schema.Teacher> {
  district: ItemApi<Schema.District>;
  school: ItemApi<Schema.School>;
  schools: IdListApi<Schema.School>;
  sections: IdListApi<Schema.Section>;
  students: IdListApi<Schema.Student>;
}

/**
 * Creates a Teacher api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Teacher {
  const path = '/v2.0/teachers';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    school: itemApi<Schema.School>(client, path, 'school'),
    schools: listApi<Schema.School>(client, path, {resource: 'schools'}),
    sections: listApi<Schema.Section>(client, path, {resource: 'sections'}),
    students: listApi<Schema.Student>(client, path, {resource: 'students'}),
  };
  const resource = createApi<Schema.Teacher, Teacher>(client, path, extraApis);
  return resource;
}
