import MockAdapter from 'axios-mock-adapter';

import {createInstance} from '../src';

const auth = {
  username: 'clientId',
  password: 'clientSecret'
};
const instance = createInstance();
const mock = new MockAdapter(instance.client);

test('should be able to retrieve application OAuth tokens', async () => {
  mock.onGet().replyOnce(200, mockData);
  const tokens = await instance.tokens.list({auth});
  expect(tokens).toEqual(mockData);
});

test('should be able to exchange a code for an access token', async () => {
  mock.onPost().replyOnce(200, mockData.data[0]);
  const token = await instance.tokens.get({
    auth,
    data: {
      code: 'code',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/oauth/callback',
    },
  });
  expect(token).toEqual(mockData.data[0]);
});

test('should be able to get tokeninfo for instant login tokens', async () => {
  const mock = new MockAdapter(instance.client);
  mock.onGet().replyOnce(200, mockTokenInfo);
  const info = await instance.tokens.info('il_DEMO_BASIC_STUDENT_TOKEN').catch(e => e);
  expect(info).toBeTruthy();
  expect(info.client_id).toEqual('94e0178da52a29e144bf');
});

const mockData = {
  data: [{
    id: '000000000000000000000000',
    access_token: '00d0000000000000000000000000000000000000',
    created: new Date().toISOString(),
    owner: {
      id: '000000000000000000000000',
      type: 'district',
    },
    scopes: [
      'read:district_admins', 'read:districts', 'read:school_admins', 'read:schools',
      'read:sections', 'read:sis', 'read:student_contacts', 'read:students', 'read:teachers',
      'read:user_id'
    ],
  }],
  links: [{rel: 'self', uri: 'https://clever.com/oauth/tokens'}],
};

const mockTokenInfo = {
  client_id: '94e0178da52a29e144bf',
  scopes: [
    'read:district_admins_basic',
    'read:school_admins_basic',
    'read:students_basic',
    'read:teachers_basic',
    'read:user_id',
  ],
};
