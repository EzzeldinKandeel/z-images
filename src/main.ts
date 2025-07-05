import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { EnvironmentVariables } from './env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // (ConfigService) is injected differently outside of modules:
  const configService = app.get(ConfigService<EnvironmentVariables>);
  // The built-in (ValidationPipe) uses the 'class-validator' package
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(configService.get('PORT') ?? 3000);
}

// ESLint complains that this should be awaited,
// but this is the way they do it in Nest's official documentation.
bootstrap();
