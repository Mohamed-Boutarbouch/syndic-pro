import { z } from 'zod';

/** ISO 8601 datetime string, used for every timestamp field on the wire. */
export const isoDateTime = z.iso.datetime();

/** ISO 8601 date-only string (no time component), e.g. due dates, fiscal years. */
export const isoDate = z.iso.date();

/** Standard server-generated fields every entity has — omit these from create schemas. */
export const serverTimestamps = {
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
};
