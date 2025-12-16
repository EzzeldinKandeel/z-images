import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { EnvironmentVariables } from './env.validation';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  // (ConfigService) is injected differently outside of modules:
  const configService = app.get(ConfigService<EnvironmentVariables>);

  const config = new DocumentBuilder()
    .setTitle('z-images')
    .setDescription('The image storage and maniputlation API')
    .setVersion('1.0')
    .addTag('images')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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

void bootstrap();
