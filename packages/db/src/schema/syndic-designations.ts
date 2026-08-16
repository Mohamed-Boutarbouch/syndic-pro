import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { syndicEvent } from './enums.js';
import { properties } from './properties.js';
import { user } from './auth/index.js';

export const syndicDesignations = pgTable(
  'syndic_designations',
  {
    ...baseId,
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    event: syndicEvent('event').notNull().default('assigned'),
    transferredFromUserId: text('transferred_from_user_id').references(
      () => user.id,
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
    index('idx_syndic_designations_property_id').on(table.propertyId),
    index('idx_syndic_designations_user_id').on(table.userId),
  ],
);
