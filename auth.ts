import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import dotenv from 'dotenv';

dotenv.config();

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = 'okeanoss_secret_key_which_must_be_at_least_32_chars_long_for_security';
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name email role { canManageContent canManageUsers }',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: {
        create: {
          name: 'Super Admin',
          canManageContent: true,
          canManageUsers: true,
        },
      },
    },
  },
});

const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { withAuth, session };
