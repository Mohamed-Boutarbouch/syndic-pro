import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${req.method} ${req.url} ${Date.now() - start}ms`),
        ),
      );
  }
}
