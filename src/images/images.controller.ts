import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

const fileValidators = [
  new MaxFileSizeValidator({ maxSize: 100000000 }), // 10MB.
  new FileTypeValidator({ fileType: 'image/*' }),
];

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':imagePath')
  findOne(@Param('imagePath') imagePath: string) {
    return this.findOne(imagePath);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  upload(
    @UploadedFiles(new ParseFilePipe({ validators: fileValidators }))
    images: Array<Express.Multer.File>,
  ) {
    return this.imagesService.upload(images);
  }
}
