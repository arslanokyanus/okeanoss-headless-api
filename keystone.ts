import { config } from '@keystone-6/core';
import { lists } from './schema';

export default config({
  db: {
    provider: 'postgresql',
    url: 'postgres://okeanoss_api:okeanoss_api_secure_pass_2026@localhost/okeanoss_api',
  },
  lists,
});
