import {
  Controller,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express, Request as Req } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

const fileValidators = [
  new MaxFileSizeValidator({ maxSize: 100000000 }), // 10MB.
  new FileTypeValidator({ fileType: 'image/*' }),
];

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':imagePath')
  @UseGuards(JwtAuthGuard)
  // Specifying the content type makes the browser view the image
  // instead of automatically downloading it.
  @Header('Content-Type', 'image')
  async findOne(@Param('imagePath') imagePath: string, @Request() req: Req) {
    return this.imagesService.findOne(imagePath, req.user as User);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles(new ParseFilePipe({ validators: fileValidators }))
    images: Array<Express.Multer.File>,
    @Request() req: Req,
  ) {
    return this.imagesService.upload(images, req.user as User);
  }
}
