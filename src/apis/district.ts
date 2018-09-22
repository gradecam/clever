import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi} from './';

/**
 * District api specification
 */
export interface District extends Api<Schema.District, {}> {}

/**
 * Return a District api instance
 * @param client
 */
export function create(client: ClientInstance): District {
  const path = '/v2.0/districts';
  return createApi<Schema.District, District, {}>(client, path);
}
