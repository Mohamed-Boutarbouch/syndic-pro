import { pgTable, text } from 'drizzle-orm/pg-core';

import { baseId, timestamps } from './helpers/columns.js';

export const buildings = pgTable('buildings', {
  ...baseId,
  name: text('name').notNull(),
  ...timestamps,
});
