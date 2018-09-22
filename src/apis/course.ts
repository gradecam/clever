import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Course api definition
 */
export interface Course extends Api<Schema.Course> {
  district: ItemApi<Schema.District>;
  sections: IdListApi<Schema.Section>;
}

/**
 * Creates a Course api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Course {
  const path = '/v2.0/courses';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    sections: listApi<Schema.Section>(client, path, {resource: 'sections'}),
  };
  const resource = createApi<Schema.Course, Course>(client, path, extraApis);
  return resource;
}
