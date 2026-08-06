// Export everything that is safe to share everywhere.
export * from './schema/index.js';

// Re-export only types from the client so consumers can use them
// without pulling in runtime code.
export type { Db } from './client.js';
