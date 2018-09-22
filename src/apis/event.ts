import {ClientInstance} from '..';
import * as Schema from '../schema';

import {Api, createApi, ListParams} from './';

/**
 * Event api specification
 */
export interface Event extends Api<Schema.Event, EventListParams> {}

export interface EventListParams extends ListParams {
  school?: string;
  record_type?: Schema.TEvent;
}

/**
 * Return an Event api instance
 * @param client
 */
export function create(client: ClientInstance): Event {
  const path = '/v2.0/events';
  return createApi<Schema.Event, Event, EventListParams>(client, path);
}
