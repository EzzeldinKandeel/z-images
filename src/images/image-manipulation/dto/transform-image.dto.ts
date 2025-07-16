import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

const effects = [
  'blur',
  'dither',
  'fisheye',
  'greyscale',
  'invert',
  'pixelate',
  'sepia',
] as const;

const formats = ['bmp', 'gif', 'jpeg', 'png', 'tiff'] as const;

class Resize {
  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
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

class Flip {
  @IsBoolean()
  @IsOptional()
  horizontal?: boolean;

  @IsOptional()
  @IsBoolean()
  vertical?: boolean;
}

export class Transformations {
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

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Flip)
  flip: Flip;

  @IsIn(effects)
  @IsOptional()
  effect: (typeof effects)[number];

  @IsIn(formats)
  @IsOptional()
  format: (typeof formats)[number];
}

export class TransformImageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Transformations)
  transformations: Transformations;
}
