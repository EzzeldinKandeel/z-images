import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
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

class Flip {
  @IsBoolean()
  horizontal: boolean;

  @IsBoolean()
  vertical: boolean;
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

  @IsIn(['bmp', 'gif', 'jpeg', 'png', 'tiff'])
  @IsOptional()
  format: 'bmp' | 'gif' | 'jpeg' | 'png' | 'tiff';

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Flip)
  flip: Flip;

  @IsIn([
    'blur',
    'dither',
    'fisheye',
    'greyscale',
    'invert',
    'pixelate',
    'sepia',
  ])
  @IsOptional()
  effect:
    | 'blur'
    | 'dither'
    | 'fisheye'
    | 'greyscale'
    | 'invert'
    | 'pixelate'
    | 'sepia';
}

export class TransformImageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Transformations)
  transformations: Transformations;
}
