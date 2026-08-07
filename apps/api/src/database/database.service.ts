import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { createDbClient, type Db } from '@syndic-pro/db/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly db: Db;

  constructor() {
    this.db = createDbClient(process.env.DATABASE_URL!);
  }

  async onModuleInit() {
    // Optional:
    // await sql`select 1`
  }

  async onModuleDestroy() {
    // close pool
    await this.db.$client.end();
  }
}
