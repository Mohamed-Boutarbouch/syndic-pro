import type { Table } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const isoDate = () => z.iso.datetime();

/**
 * Refines every column that drizzle-zod would otherwise generate as a
 * bare z.date() into an ISO-8601 string schema, so createSelectSchema()
 * output is always JSON-Schema-safe — regardless of the column's name.
 * Detects by actual Zod type, not by a hardcoded name list, so it
 * covers createdAt/updatedAt/deletedAt AND any future date column
 * (paymentDate, dueDate, etc.) with zero changes needed here.
 */
export function withDateRefinements<T extends Table>(table: T) {
  // Generate the raw (unrefined) schema once, just to inspect shapes.
  const raw = createSelectSchema(table);
  const refinements: Record<string, () => z.ZodTypeAny> = {};

  for (const [key, schema] of Object.entries(raw.shape)) {
    if (isZodDate(schema)) {
      refinements[key] = isoDate;
    }
  }

  return refinements as Partial<
    Record<keyof T['_']['columns'], () => z.ZodTypeAny>
  >;
}

function isZodDate(schema: unknown): boolean {
  // Handles bare ZodDate and nullable/optional-wrapped ZodDate.
  const def = (schema as z.ZodTypeAny)?._zod?.def;
  if (!def) return false;
  if (def.type === 'date') return true;
  if (
    (def.type === 'nullable' || def.type === 'optional') &&
    'innerType' in def
  ) {
    return isZodDate(def.innerType as z.ZodTypeAny);
  }
  return false;
}
