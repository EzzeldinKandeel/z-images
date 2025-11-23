import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { NestMinioModule, NestMinioOptions } from 'nestjs-minio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageManipulationService } from './image-manipulation/image-manipulation.service';
import { BullModule } from '@nestjs/bullmq';
import { UtilsModule } from 'src/utils/utils.module';
import { join } from 'node:path';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImageManipulationService],
  imports: [
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) =>
        ({
          endPoint: configService.get('MINIO_ENDPOINT'),
          port: configService.get('MINIO_PORT'),
          useSSL: false, // for lacal development.
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        }) as NestMinioOptions,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Image]),
    ConfigModule,
    BullModule.registerQueue({
      name: 'imageManipulation',
      processors: [join(__dirname, 'images.processor.js')],
    }),
    UtilsModule,
  ],
})
export class ImagesModule {}
