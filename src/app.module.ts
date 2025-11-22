import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import { EnvironmentVariables, validate } from './env.validation';
import { ImagesModule } from './images/images.module';
import { BullModule } from '@nestjs/bullmq';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Auto DB migrations (for early development only)
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        connection: {
          host: configService.get('REDIS_HOST') as string,
          port: +configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ImagesModule,
    UtilsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
