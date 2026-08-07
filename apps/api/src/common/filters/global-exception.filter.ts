import {
  BadRequestException,
  InternalServerErrorException,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';
import { isPgDriverError, mapPgError } from '../../database/pg-error.mapper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpException = this.normalize(exception);
    const status = httpException.getStatus();
    const body = httpException.getResponse();

    this.log(status, exception, request);

    response.status(status).json(body);
  }

  private normalize(exception: unknown): HttpException {
    if (exception instanceof HttpException) return exception;
    if (exception instanceof ZodError) {
      return new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details: exception.issues,
      });
    }
    if (isPgDriverError(exception)) return mapPgError(exception);

    return new InternalServerErrorException({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    });
  }

  private log(status: number, exception: unknown, request: any) {
    const msg = `${request?.method} ${request?.url} -> ${status}`;
    if (status >= 500) {
      this.logger.error(
        msg,
        exception instanceof Error ? exception.stack : exception,
      );
    } else if (status >= 400) {
      this.logger.warn(msg);
    }
  }
}
