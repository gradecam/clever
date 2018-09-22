import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, IdListApi, itemApi, ItemApi, listApi} from '.';

/**
 * Term api definition
 */
export interface Term extends Api<Schema.Term> {
  district: ItemApi<Schema.District>;
  sections: IdListApi<Schema.Section>;
}

/**
 * Creates a Term api instance
 * @param client client to use when making HTTP requests
 */
export function create(client: ClientInstance): Term {
  const path = '/v2.0/terms';
  const extraApis = {
    district: itemApi<Schema.District>(client, path, 'district'),
    sections: listApi<Schema.Section>(client, path, {resource: 'sections'}),
  };
  const resource = createApi<Schema.Term, Term>(client, path, extraApis);
  return resource;
}
