import { boolean, char, text, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';

export const properties = pgTable('properties', {
  ...baseId,
  name: varchar('name', { length: 200 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }),
  countryCode: char('country_code', { length: 2 }).notNull().default('MA'),
  isActive: boolean('is_active').notNull().default(true),
  ...timestamps,
});
