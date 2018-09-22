import {ClientInstance} from '../';
import * as Schema from '../schema';

import {OAuthTokensResponse} from './response';

/**
 * Defines the API endpoints for interacting with Clever.
 */
export interface OAuth {
  /**
   * Attempt to exchange an instant login code for an access token
   *
   * @param opts
   * @param opts.auth client ID and secret for your application
   * @param opts.data request data
   */
  get(opts: OAuthTokenOpts): Promise<Schema.OAuthToken>;

  /**
   * Returns details about the application the token is associated with and allowed scopes.
   *
   * @param token an Instant Login token
   */
  info(token: string): Promise<Schema.OAuthTokenInfo>;

  /**
   * Retrieve OAuth tokens associated with your application.
   *
   * @param auth client ID and secret for your application
   * @param district (optional) only tokens for the specific district, otherwise all tokens
   * associated with your application.
   */
  list(opts: OAuthTokensOpts): Promise<OAuthTokensResponse>;
}

/**
 * Information required to exchange an Instant Login code for an OAuth access token.
 */
export interface OAuthTokenOpts {
  auth: Auth;
  data: TokenData;
}

/**
 * Tokens listing request options
 *
 * @property {Object} auth authorization data
 * @property {string} auth.username clientID
 * @property {string} auth.password clientSecret
 * @property {Object} params (optional) parameters to send with the request
 * @property {string} params.district limit response to tokens for a specific district
 * @property {string} params.owner_type Clever docs indicate this is required and the only valid value is 'district' in practice this does not appear to be the case but we will make the request that way anyway.
 */
export interface OAuthTokensOpts {
  auth: Auth;
  params?: {district?: string; owner_type?: 'district'};
}

/**
 * Client authorization data.
 *
 * @property {string} username clientID
 * @property {string} password clientSecret
 */
interface Auth {
  username: string;
  password: string;
}

/**
 * Token request details.
 *
 * @property {string} code instant login code
 * @property {string} grant_type
 * @property {string} redirect_uri one of your applications registered URIs
 */
export interface TokenData {
  code: string;
  grant_type: string;
  redirect_uri: string;
}

/**
 * Returns an API instance.
 * @param client
 * @param identityBaseUrl
 */
export function create(client: ClientInstance): OAuth {
  const tokensUrl = `https://clever.com/oauth/tokens`;
  return {
    get: ({auth, data}: OAuthTokenOpts): Promise<Schema.OAuthToken> => {
      return client.post<Schema.OAuthToken>(tokensUrl, data, {auth}).then(resp => resp.data);
    },
    info: (token: string): Promise<Schema.OAuthTokenInfo> => {
      return client
          .get<Schema.OAuthTokenInfo>(
              `https://clever.com/oauth/tokeninfo`,
              {headers: {Authorization: `Bearer ${token}`}},
              )
          .then(resp => resp.data);  // tslint:disable-line
    },
    list: ({auth, params}: OAuthTokensOpts): Promise<OAuthTokensResponse> => {
      params = Object.assign(params || {}, {owner_type: 'district'});
      return client.get<OAuthTokensResponse>(tokensUrl, {auth, params}).then(resp => resp.data);
    },
  };
}
