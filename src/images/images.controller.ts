import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService, ImageData } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TransformImageDto } from './dto/transform-image.dto';

const fileValidators = [
  new MaxFileSizeValidator({ maxSize: 100000000 }), // 10MB.
  new FileTypeValidator({ fileType: 'image/' }),
];

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':imagePath')
  @UseGuards(JwtAuthGuard)
  // Specifying the content type makes the browser view the image
  // instead of automatically downloading it.
  @Header('Content-Type', 'image/*')
  async findOne(
    @Param('imagePath') imagePath: string,
    @CurrentUser() user: User,
  ): Promise<StreamableFile> {
    return this.imagesService.findOne(imagePath, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles(new ParseFilePipe({ validators: fileValidators }))
    images: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ): Promise<Array<ImageData>> {
    return this.imagesService.upload(images, user);
  }

  @Post(':imagePath/transform')
  @UseGuards(JwtAuthGuard)
  async transform(
    @Param('imagePath') imagePath: string,
    @CurrentUser() user: User,
    @Body() transformImageDto: TransformImageDto,
  ): Promise<ImageData> {
    const image = await this.imagesService.findOne(imagePath, user);
    const imageBufferData = await this.imagesService.transform(
      image,
      transformImageDto.transformations,
    );

    return this.imagesService.uploadSingleImage(
      imageBufferData.imageBuffer,
      imageBufferData.mimeType,
      user,
    );
  }
}
