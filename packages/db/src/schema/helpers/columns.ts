import { serial, timestamp, uuid } from 'drizzle-orm/pg-core';

export const baseId = {
  id: serial('id').primaryKey(),
};

export const baseUuId = {
  id: uuid('id').primaryKey().defaultRandom(),
};

export const timestamps = {
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
};

export const softDelete = {
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
};
