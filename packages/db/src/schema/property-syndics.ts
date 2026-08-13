import { index, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { syndicEvent } from './enums.js';
import { properties } from './properties.js';
import { users } from './users.js';

export const propertySyndics = pgTable(
  'property_syndics',
  {
    ...baseId,
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    event: syndicEvent('event').notNull().default('assigned'),
    transferredFromUserId: integer('transferred_from_user_id').references(
      () => users.id,
      { onDelete: 'set null' },
    ),
    assignedAt: timestamp('assigned_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    resignedAt: timestamp('resigned_at', { mode: 'date', withTimezone: true }),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    index('idx_property_syndics_property_id').on(table.propertyId),
    index('idx_property_syndics_user_id').on(table.userId),
  ],
);
