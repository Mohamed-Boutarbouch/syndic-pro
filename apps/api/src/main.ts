import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // required by @thallesp/nestjs-better-auth
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'auth/(.*)', method: -1 as any }], // don't double-prefix if basePath already includes /api/auth — verify against your version, see note below
  });

  app.enableCors({
    origin: [process.env.WEB_ORIGIN!],
    credentials: true, // required for Better Auth cookies
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Syndic Pro API')
    .setDescription('Property/syndic management API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
