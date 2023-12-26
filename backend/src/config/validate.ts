import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsNumber()
  PORT!: number;

  @IsOptional()
  @IsString()
  DATABASE_HOST!: string;

  @IsOptional()
  @IsNumber()
  DATABASE_PORT!: number;

  @IsOptional()
  @IsString()
  DATABASE_USERNAME!: string;

  @IsOptional()
  @IsString()
  DATABASE_PASSWORD!: string;

  @IsOptional()
  @IsString()
  DATABASE_TYPE!: string;

  @IsOptional()
  @IsString()
  DATABASE_NAME!: string;

  @IsOptional()
  @IsNumber()
  THROTTLER_TTL!: number;

  @IsOptional()
  @IsNumber()
  THROTTLER_LIMIT!: number;
}

export default function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
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
