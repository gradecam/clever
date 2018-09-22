import {ClientInstance} from '..';
import * as Schema from '../schema';
import * as stream from '../stream';

import * as contact from './contact';
import * as course from './course';
import * as district from './district';
import * as districtAdmin from './district_admin';
import * as event from './event';
import * as oauth from './oauth';
import {ItemResponse, ListResponse, MeResponse} from './response';
import * as school from './school';
import * as schoolAdmin from './school_admin';
import * as section from './section';
import * as student from './student';
import * as teacher from './teacher';
import * as term from './term';

export type ItemPromise<T> = Promise<T>;
export type ListPromise<T> = Promise<ListResponse<T>>;

export interface ItemApi<T = Schema.Resource> {
  (id: string): ItemPromise<T>;
}

export interface ListApi<T = Schema.Resource, P = ListParams> {
  (): ListPromise<T>;
  (opts: ListOptsPromise<P>): ListPromise<T>;
  (opts: ListOptsStream<P>): stream.ReadableStream<T>;
}

export interface IdListApi<T = Schema.Resource, P = ListParams> {
  (id: string): ListPromise<T>;
  (id: string, opts: ListOptsPromise<P>): ListPromise<T>;
  (id: string, opts: ListOptsStream<P>): stream.ReadableStream<T>;
}

/**
 * API Query parameters
 * @property {number} limit maximum value is 10000
 * @property {string} ending_before document ID
 * @property {string} starting_after document ID
 */
export interface ListParams {
  limit?: number;
  ending_before?: string;
  starting_after?: string;
}

/**
 * List API options
 * @property {params} ListParams query parameters
 * @property {stream}
 */
export interface ListOpts<P = ListParams> {
  params?: P;
  stream?: boolean;
}

export interface ListOptsPromise<P = ListParams> extends ListOpts<P> {
  params?: P;
  stream?: false;
}

export interface ListOptsStream<P = ListParams> extends ListOpts<P> {
  params?: P;
  stream: true;
}

/**
 * Generic resource definition
 */
export interface Api<T = Schema.Resource, P = ListParams> {
  path: string;
  get: ItemApi<T>;
  list: ListApi<T, P>;
}

interface ExtraApis {
  [key: string]: ItemApi|ListApi|IdListApi;
}

/**
 * Returns a function which retrieves a specific item
 * @param client api client
 * @param path api base path
 * @param name (optional) resouce name
 */
export function itemApi<T>(client: ClientInstance, path: string, name = ''): ItemApi<T> {
  return (id: string) => {
    if (!id) {
      throw new Error('must specify an ID');
    }
    const url = name ? `${path}/${id}/${name}` : `${path}/${id}`;
    return client.get<ItemResponse<T>>(url).then(resp => resp.data.data);
  };
}

export const LIMIT_MAX = 10000;
export const LIMIT_DEFAULT = 100;

/**
 * If limit is outside of the allowed values throw an error.
 *
 * @param limit list limit parameter (page size)
 */
function checkLimit(limit: number) {
  if (typeof limit !== 'number') {
    throw new Error('limit must be a number');
  }
  if (limit < 1) {
    throw new Error('limit must be >= 1');
  } else if (limit > LIMIT_MAX) {
    throw new Error(`limit must be <= ${LIMIT_MAX}`);
  }
}

interface ListApiOpts {
  defaults?: any;  // tslint:disable-line
}

interface IdListApiOpts extends ListApiOpts {
  resource: string;
}

/**
 * Returns a function to retrieve a list of a given resource.
 *
 * @param client api client
 * @param path api base path
 * @param apiOpts api options (default: {})
 */
export function listApi<T, P = ListParams>(
    client: ClientInstance, path: string, apiOpts?: ListApiOpts): ListApi<T, P>;
export function listApi<T, P = ListParams>(
    client: ClientInstance, path: string, apiOpts: IdListApiOpts): IdListApi<T, P>;
export function listApi<T, P = ListParams>(
    client: ClientInstance, path: string, apiOpts?: any) {  // tslint:disable-line
  apiOpts = Object.assign({resource: '', defaults: {}}, apiOpts);
  const defaults = Object.assign({limit: LIMIT_DEFAULT}, apiOpts.defaults);
  const resource: string = apiOpts.resource;
  return (...args: any[]) => {  // tslint:disable-line
    const id: string = resource && args[0];
    if (resource && !id || typeof id !== 'string') {
      throw new Error('must specify an ID');
    }
    const url = resource ? `${path}/${id}/${resource}` : `${path}`;
    const opts = Object.assign({}, args[resource ? 1 : 0]);
    // console.log({opts});
    const params = Object.assign({}, defaults, opts.params);
    checkLimit(params.limit);
    if (opts.stream) {
      return stream.create<T>(client, url, params);
    }
    return client.get<ListResponse<T>>(url, {params}).then(resp => resp.data);
  };
}

/**
 * Returns a new Api object.
 * @param client api client
 * @param path api base path
 * @param extraApis (optional) extra resource apis
 */
export function createApi<T, R extends Api<T, P> = Api<T, P>, P = ListParams>(
    client: ClientInstance, path: string, extraApis: ExtraApis = {}): R {
  const resource: R = Object.create(null, {
    path: {
      configurable: false,
      enumerable: true,
      value: path,
      writable: false,
    },
    get: {
      configurable: false,
      enumerable: true,
      value: itemApi<T>(client, path),
      writable: false,
    },
    list: {
      configurable: false,
      enumerable: true,
      value: listApi<T>(client, path),
      writable: false,
    },
  });
  for (const key of Object.keys(extraApis)) {
    Object.defineProperty(resource, key, {
      configurable: false,
      enumerable: true,
      value: extraApis[key],
      writable: false,
    });
  }
  return resource;
}

/**
 * Available apis
 */
export interface Apis {
  // Identity APIs
  me(): Promise<ItemResponse<Schema.Me>>;
  tokens: oauth.OAuth;

  // Data APIs
  contacts: contact.Contact;
  courses: course.Course;
  districts: district.District;
  districtAdmins: districtAdmin.DistrictAdmin;
  events: event.Event;
  schools: school.School;
  schoolAdmins: schoolAdmin.SchoolAdmin;
  sections: section.Section;
  students: student.Student;
  teachers: teacher.Teacher;
  terms: term.Term;
}

/**
 * Creates instances of each of the API definitions
 * @param client api client
 */
export function createApis(client: ClientInstance): Apis {
  return {
    me: () => client.get<MeResponse<Schema.Me>>('/v2.0/me').then(resp => resp.data),
    tokens: oauth.create(client),
    contacts: contact.create(client),
    courses: course.create(client),
    districts: district.create(client),
    districtAdmins: districtAdmin.create(client),
    events: event.create(client),
    schools: school.create(client),
    schoolAdmins: schoolAdmin.create(client),
    sections: section.create(client),
    students: student.create(client),
    teachers: teacher.create(client),
    terms: term.create(client),
  };
}

export * from './response';
