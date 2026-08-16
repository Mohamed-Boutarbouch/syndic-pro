import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { user } from './auth/index.js';
import { baseId, timestamps } from './helpers/columns.js';

export const coOwners = pgTable('co_owners', {
  ...baseId,
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  userId: text('user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
});
