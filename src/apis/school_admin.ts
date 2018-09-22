import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * SchoolAdmin api definition
 */
export interface SchoolAdmin extends Api<Schema.SchoolAdmin> {
  district: ItemApi<Schema.District>;
  schools: IdListApi<Schema.School>;
}

/**
 * Creates a SchoolAdmin api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): SchoolAdmin {
  const path = '/v2.0/school_admins';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    schools: listApi<Schema.School>(client, path, {resource: 'schools'}),
  };
  const resource = createApi<Schema.SchoolAdmin, SchoolAdmin>(client, path, extraApis);
  return resource;
}
