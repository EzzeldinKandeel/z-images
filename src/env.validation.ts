import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

// For environment variable validation.
// When used with (ConfigService), this enables TypeScript
// to autocomplete environment variable keys, which is very handy.
export class EnvironmentVariables {
  @IsString()
  DOMAIN_NAME: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE_NAME: string;

  @IsNumber()
  BCRYPT_SALT_ROUNDS: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  MINIO_ENDPOINT: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  MINIO_PORT: number;

  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsString()
  MINIO_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
