import { index, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { syndicEvent } from './enums.js';
import { condos } from './condos.js';
import { users } from './users.js';

export const condoSyndics = pgTable(
  'condo_syndics',
  {
    ...baseId,
    condoId: integer('condo_id')
      .notNull()
      .references(() => condos.id, { onDelete: 'cascade' }),
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
    index('idx_condo_syndics_condo_id').on(table.condoId),
    index('idx_condo_syndics_user_id').on(table.userId),
  ],
);
