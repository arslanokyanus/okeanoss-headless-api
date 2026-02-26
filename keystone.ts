import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { extendGraphqlSchema } from './customSchema';

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: 'postgres://okeanoss_api:okeanoss_api_secure_pass_2026@localhost/okeanoss_api',
    },
    server: {
      port: 3000,
      cors: { origin: ['*'], credentials: true },
    },
    lists,
    session,
    graphql: {
      extendGraphqlSchema,
    },
  })
);
