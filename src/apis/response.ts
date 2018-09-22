import * as Schema from '../schema';

// tslint:disable:no-any
/**
 * Response data format when requesting a single item.
 */
export interface ItemResponse<T = any> {
  data: T;
  links: Link[];
}

/**
 * Response format when requesting a list of items.
 */
export interface ListResponse<T = any> {
  data: Array<ListItem<T>>;
  links: Link[];
}

/**
 * Format of items within the data property for list apis.
 */
export interface ListItem<T = any> {
  data: T;
  uri: string;
}

/**
 * Format of link data in
 */
export interface Link {
  rel: string;
  uri: string;
}

/**
 * Me response format.
 */
export interface MeResponse<T = any> extends ItemResponse<T> {
  type: string;
}

/**
 * OAuth Token listing response
 */
export interface OAuthTokensResponse {
  data: Schema.OAuthToken[];
  links: Link[];
}
