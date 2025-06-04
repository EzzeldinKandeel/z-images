import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  upload(@UploadedFiles() images: Array<Express.Multer.File>) {
    console.log(images);

    return;
  }
}
