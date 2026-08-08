import { date, index, integer, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { units } from './units.js';
import { users } from './users.js';

export const ownerships = pgTable(
  'ownerships',
  {
    ...baseId,
    unitId: integer('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'restrict' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    startedAt: date('started_at', { mode: 'date' }).notNull(),
    endedAt: date('ended_at', { mode: 'date' }),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    index('idx_ownerships_unit_id').on(table.unitId),
    index('idx_ownerships_user_id').on(table.userId),
    index('idx_ownerships_active').on(table.unitId, table.startedAt),
  ],
);
