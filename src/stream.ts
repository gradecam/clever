// tslint:disable:no-any
import {Readable} from 'stream';

import {ClientInstance} from '.';
import {LIMIT_DEFAULT, ListResponse} from './apis';
import {Resource} from './schema';

export interface ReadableStream<T = Resource> {
  pause(): this;
  resume(): this;
  isPaused(): boolean;

  on(event: 'close', listener: () => void): this;
  on(event: 'data', listener: (chunk: T) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'readable', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: string|symbol, listener: (...args: any[]) => void): this;

  once(event: 'close', listener: () => void): this;
  once(event: 'data', listener: (chunk: T) => void): this;
  once(event: 'end', listener: () => void): this;
  once(event: 'readable', listener: () => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: string|symbol, listener: (...args: any[]) => void): this;
}

/**
 * Creates a readable stream to retrieve all data from a list API
 * @param client api client
 */
export function create<T = Resource>(
    client: ClientInstance, url: string, params: any): ReadableStream<T> {
  const cnt = {
    api: 0,
    docs: 0,
    req: 0,
    limit: params.limit,
  };

  const readable = new Readable({
    objectMode: true,
    read: (size) => {
      if (cnt.req > cnt.docs) {
        // We have already requested more data than the number of
        // documents we have.
        return;
      }
      cnt.api++;
      cnt.req += cnt.limit;
      readable.emit('request', url, params, cnt.api);

      client.get<ListResponse<T>>(url, {params})
          .then((resp) => {
            const next = resp.data.links.find(x => x.rel === 'next');
            if (next) {
              // set the URL for the next time read is called
              // don't follow the link now since we want to
              // allow the consumer to control the flow rate
              url = next.uri;
              // any necessary params will be baked into the new
              // url so clear out the params object
              params = {} as any;
            }
            for (const item of resp.data.data) {
              cnt.docs++;
              readable.push(item.data);
            }
            if (!next) {
              readable.push(null);
            }
          })
          .catch(err => {
            readable.emit('error', err);
            readable.push(null);
          });
    },
  });
  return readable;
}
