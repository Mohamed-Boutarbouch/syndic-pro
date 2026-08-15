import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.config';

@Module({
  imports: [
    BetterAuthModule.forRoot(auth, {
      // disableExceptionFilter / disableBodyParser handled by the library's global setup
    }),
  ],
})
export class AuthModule {}
