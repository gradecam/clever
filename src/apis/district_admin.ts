import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, itemApi, ItemApi} from '.';

/**
 * DistrictAdmin api definition
 */
export interface DistrictAdmin extends Api<Schema.DistrictAdmin> {
  district: ItemApi<Schema.District>;
}

/**
 * Creates a DistrictAdmin api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): DistrictAdmin {
  const path = '/v2.0/district_admins';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
  };
  const resource = createApi<Schema.DistrictAdmin, DistrictAdmin>(client, path, extraApis);
  return resource;
}
