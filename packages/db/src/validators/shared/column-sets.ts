import type { Table } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';

const SERVER_CONTROLLED_COLUMNS = new Set(['id', 'createdAt', 'updatedAt']);

export function withoutServerColumns<T extends Table>(
  table: T,
): Partial<Record<keyof T['_']['columns'], true>> {
  const columns = getTableColumns(table);
  const omit: Record<string, true> = {};

  for (const key of Object.keys(columns)) {
    if (SERVER_CONTROLLED_COLUMNS.has(key)) {
      omit[key] = true;
    }
  }

  return omit as Partial<Record<keyof T['_']['columns'], true>>;
}
