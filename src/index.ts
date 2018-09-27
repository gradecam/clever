import Axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import * as http from 'http';
import * as https from 'https';
import * as Qs from 'qs';

import * as Api from './apis';
import * as Schema from './schema';

export {Api, Schema};

// Used when retrying rate limited requests without affecting
// the default axios client.
const defaultClient = createRequestClient({});

/**
 * Errors which occur during HTTP requests
 */
export interface ClientError extends AxiosError {}

/**
 * HTTP request client
 */
export interface ClientInstance extends AxiosInstance {}

/**
 * A client for making API requests.
 *
 * @property {ClientInstance} client to be used for any arbitray HTTP request to service endpoints
 * @property {Api.Contact} contacts Contact API requests.
 * @property {Api.Course} courses Course API requests.
 * @property {Api.District} districts District API requests.
 * @property {Api.DistrictAdmin} districtAdmins DistrictAdmin API requests.
 * @property {Api.Event} events Event API requests.
 * @property {Api.Me} me me API endpoint
 * @property {Api.School} schools School API requests.
 * @property {Api.SchoolAdmin} schoolAdmins SchoolAdmin API requests.
 * @property {Api.Section} sections Section API requests.
 * @property {Api.Student} students Student API requests.
 * @property {Api.Teacher} teachers Teacher API requests.
 * @property {Api.Term} terms Term API requests.
 * @property {Api.OAuth} tokens OAuth token API requests
 */
export interface CleverClient extends Api.Apis {
  client: ClientInstance;
}

/**
 * Client configuration options.
 *
 * @property {string} baseURL API base URL (default: 'https://api.clever.com/')
 * @property {string} token OAuth access token used for API requests. (default: 'DEMO_TOKEN')
 * @property {{[key: string]: any}} headers additional headers to send with API requests.
 * @property {number} timeout maximum request duration before timeout
 */
export interface ClientConfig {
  baseURL?: string;
  token?: string;
  headers?: {[key: string]: any};  // tslint:disable-line:no-any
  timeout?: number;
}

// The following are exported for testing purposes only.
export const resetLimitHeader = 'x-ratelimit-reset';
// count of rate limited requests
export let rateLimited = 0;

/**
 * Retries rate limited requests after the rate limit has been reest
 *
 * @param err
 */
function retryRateLimited(err: ClientError) {
  return new Promise((resolve, reject) => {
    if (!(err.response && err.response.status === 429)) {
      reject(err);
      return;
    }
    rateLimited++;
    const headers = err.response.headers;
    // tslint:disable-next-line
    const resetTimestamp = parseInt(headers[resetLimitHeader], 10) * 1000;
    const timeout = Math.max(resetTimestamp - Date.now(), 0);
    setTimeout(() => {
      resolve(defaultClient.request(err.config));
    }, timeout);
  });
}

const DEFAULT_TIMEOUT = 2000;

/**
 * Serialize parameters into a string.
 *
 * @param params
 */
export function paramsSerializer(params: any = {}): string {  // tslint:disable-line
  return Qs.stringify(params, {arrayFormat: 'repeat'});
}

/**
 * Returns a client to use when making HTTP requests.
 *
 * @param config
 */
function createRequestClient(config: AxiosRequestConfig) {
  config.httpAgent = new http.Agent({keepAlive: true, keepAliveMsecs: config.timeout});
  config.httpsAgent = new https.Agent({keepAlive: true, keepAliveMsecs: config.timeout});
  config.paramsSerializer = paramsSerializer;
  const instance = Axios.create(config);
  instance.interceptors.response.use(void 0, retryRateLimited);
  return instance;
}

/**
 * Creates a Clever Client
 *
 * @param config
 */
export function createInstance(config: ClientConfig = {}): CleverClient {
  config = Object.assign(
      {
        baseURL: 'https://api.clever.com/',
        headers: {},
        token: 'DEMO_TOKEN',
        timeout: DEFAULT_TIMEOUT,
      },
      config);
  if (!config.token) {
    throw new Error('A token is required.');
  }
  const {token} = config;
  delete config.token;
  const apiCfg: ClientConfig = Object.assign({}, config);
  Object.assign(apiCfg.headers, {Authorization: `Bearer ${token}`});
  const client = createRequestClient(apiCfg);
  const apis = Api.createApis(client);
  return Object.assign(
      {
        client,
      },
      apis);
}

// tslint:disable:no-default-export
export default {createInstance};
