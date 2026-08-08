import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema/index.js';
import * as relations from './relations/index.js';

export function createDbClient(connectionString: string) {
  const pool = new Pool({ connectionString });

  return drizzle(pool, {
    schema: {
      ...schema,
      ...relations,
    },
  });
}

export type Db = ReturnType<typeof createDbClient>;
