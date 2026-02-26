import { graphql } from '@keystone-6/core';
import { Context } from '.keystone/types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'okeanoss_secret_key_which_must_be_at_least_32_chars_long_for_security';

const AuthTokenResult = graphql.object<{ token: string | null; item: any; message: string | null }>()({
  name: 'AuthTokenResult',
  fields: {
    token: graphql.field({ type: graphql.String }),
    item: graphql.field({ type: graphql.JSON }), // We'll just return it as JSON for simplicity, or we could link the User type if we knew how
    message: graphql.field({ type: graphql.String }),
  },
});

export const extendGraphqlSchema = graphql.extend(base => {
  return {
    mutation: {
      loginWithToken: graphql.field({
        type: AuthTokenResult,
        args: {
          email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(source, { email, password }, context: Context) {
          const query = `
            mutation Authenticate($email: String!, $password: String!) {
              authenticateUserWithPassword(email: $email, password: $password) {
                ... on UserAuthenticationWithPasswordSuccess {
                  sessionToken
                  item {
                    id
                    email
                    name
                  }
                }
                ... on UserAuthenticationWithPasswordFailure {
                  message
                }
              }
            }
          `;
          
          try {
            const result = await context.graphql.run({ query, variables: { email, password } }) as any;
            const authResult = result.authenticateUserWithPassword;

            if (authResult && authResult.item) {
              const user = authResult.item;
              const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                JWT_SECRET,
                { expiresIn: '30d' }
              );
              return { token, item: user, message: 'Success' };
            }
            return { token: null, item: null, message: authResult?.message || 'Authentication failed.' };
          } catch (error: any) {
            return { token: null, item: null, message: error.message };
          }
        },
      }),
    },
  };
});
