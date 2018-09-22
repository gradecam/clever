/**
 * Tokens detail
 */
export interface OAuthToken {
  id: string;
  access_token: string;
  created: string;
  owner: {
    id: string; type: string;  // more than likely it is really: 'district' | 'teacher' | 'student';
  };
  scopes: string[];
}

/**
 * Data returned from the `tokeninfo` endpoint.
 *
 * @property {string} client_id application client ID associated with the token
 * @property {string[]} scopes scope of data that can be accessed
 */
export interface OAuthTokenInfo {
  client_id: string;
  scopes: string[];
}
