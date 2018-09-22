import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Contact api definition
 */
export interface Contact extends Api<Schema.Contact> {
  district: ItemApi<Schema.District>;
  students: IdListApi<Schema.Student>;
}

/**
 * Creates a Contact api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Contact {
  const path = '/v2.0/contacts';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    students: listApi<Schema.Student>(client, path, {resource: 'students'}),
  };
  const resource = createApi<Schema.Contact, Contact>(client, path, extraApis);
  return resource;
}
