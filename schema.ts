import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, password, relationship, timestamp, select, checkbox } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      password: password({ validation: { isRequired: true } }),
      role: relationship({ ref: 'Role.users', many: false }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
  }),

  Role: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      canManageContent: checkbox({ defaultValue: false }),
      canManageUsers: checkbox({ defaultValue: false }),
      users: relationship({ ref: 'User.role', many: true }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.categories', many: true }),
    },
  }),

  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      status: select({
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
        defaultValue: 'draft',
        ui: { displayMode: 'segmented-control' },
      }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      publishDate: timestamp(),
      author: relationship({ ref: 'User.posts', many: false }),
      categories: relationship({ ref: 'Category.posts', many: true }),
    },
  }),

  SiteSettings: list({
    access: allowAll,
    ui: {
      labelField: 'siteName',
      description: 'Global configuration for the website',
      hideCreate: true,
      hideDelete: true,
    },
    fields: {
      siteName: text({ validation: { isRequired: true }, defaultValue: 'Okeanoss' }),
      siteDescription: text({ ui: { displayMode: 'textarea' } }),
      contactEmail: text(),
      maintenanceMode: checkbox({ defaultValue: false }),
    },
  }),
};
