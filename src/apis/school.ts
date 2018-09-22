import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * School api definition
 */
export interface School extends Api<Schema.School> {
  district: ItemApi<Schema.District>;
  sections: IdListApi<Schema.Section>;
  students: IdListApi<Schema.Student>;
  teachers: IdListApi<Schema.Teacher>;
}

/**
 * Creates a School api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): School {
  const path = '/v2.0/schools';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    sections: listApi<Schema.Section>(client, path, {resource: 'sections'}),
    students: listApi<Schema.Student>(client, path, {resource: 'students'}),
    teachers: listApi<Schema.Teacher>(client, path, {resource: 'teachers'}),
  };
  const resource = createApi<Schema.School, School>(client, path, extraApis);
  return resource;
}
