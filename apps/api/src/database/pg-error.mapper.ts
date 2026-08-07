import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PgDriverError } from './postgres-error.interface';

// https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_SQLSTATE = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  INVALID_TEXT_REPRESENTATION: '22P02', // e.g. malformed uuid
} as const;

export function isPgDriverError(err: unknown): err is PgDriverError & Error {
  return (
    err instanceof Error && typeof (err as PgDriverError).code === 'string'
  );
}

export function mapPgError(err: PgDriverError & Error): HttpException {
  switch (err.code) {
    case PG_SQLSTATE.UNIQUE_VIOLATION:
      return new ConflictException({
        code: 'CONFLICT',
        message: `A record with this ${err.constraint ?? 'value'} already exists.`,
        details: { constraint: err.constraint },
      });

    case PG_SQLSTATE.FOREIGN_KEY_VIOLATION:
      return new UnprocessableEntityException({
        code: 'INVALID_REFERENCE',
        message: `Referenced resource does not exist.`,
        details: { constraint: err.constraint },
      });

    case PG_SQLSTATE.NOT_NULL_VIOLATION:
      return new BadRequestException({
        code: 'MISSING_FIELD',
        message: `Field '${err.column}' is required.`,
        details: { column: err.column },
      });

    case PG_SQLSTATE.CHECK_VIOLATION:
      return new BadRequestException({
        code: 'CHECK_VIOLATION',
        message: `Value violates a database constraint.`,
        details: { constraint: err.constraint },
      });

    case PG_SQLSTATE.INVALID_TEXT_REPRESENTATION:
      return new BadRequestException({
        code: 'INVALID_INPUT',
        message: `One or more fields have an invalid format.`,
      });

    default:
      // Unknown/unexpected DB error — never leak driver internals.
      return new InternalServerErrorException({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected database error occurred.',
      });
  }
}
