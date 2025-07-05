import { Type } from 'class-transformer';
import {
  IsMimeType,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Resize {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

class Crop {
  @IsNumber()
  width: number;

  @IsNumber()
  hight: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

class Transformations {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Resize)
  resize: Resize;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Crop)
  crop: Crop;

  @IsNumber()
  @IsOptional()
  rotate: number;

  @IsString()
  @IsMimeType()
  @IsOptional()
  format: string;
}

export class TransformImageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Transformations)
  transformations: Transformations;
}
