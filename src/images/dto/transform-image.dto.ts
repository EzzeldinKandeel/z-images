import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ImageFormat } from 'src/utils/utils.types';

const formats = ['bmp', 'gif', 'jpeg', 'png', 'tiff'] as const;

class Resize {
  @IsOptional()
  @IsNumber()
  width: number;

  @IsOptional()
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
  @IsOptional()
  horizontal?: boolean;

  @IsOptional()
  @IsBoolean()
  vertical?: boolean;
}

class Filters {
  @IsNumber()
  @IsOptional()
  blur: number = 0;

  @IsBoolean()
  @IsOptional()
  dither: boolean = false;

  @IsBoolean()
  @IsOptional()
  fisheye: boolean = false;

  @IsBoolean()
  @IsOptional()
  greyscale: boolean = false;

  @IsBoolean()
  @IsOptional()
  invert: boolean = false;

  @IsNumber()
  @IsOptional()
  pixelate: number = 0;

  @IsBoolean()
  @IsOptional()
  sepia: boolean = false;
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

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Filters)
  filters: Filters;

  @IsIn(formats)
  @IsOptional()
  format: ImageFormat;
}

export class TransformImageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Transformations)
  transformations: Transformations;
}
