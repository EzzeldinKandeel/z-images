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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ImageManipulationService } from './image-manipulation/image-manipulation.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TransformImageDto } from './image-manipulation/dto/transform-image.dto';

const fileValidators = [
  new MaxFileSizeValidator({ maxSize: 100000000 }), // 10MB.
  new FileTypeValidator({ fileType: 'image/*' }),
];

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly imageManipulationService: ImageManipulationService,
  ) {}

  @Get(':imagePath')
  @UseGuards(JwtAuthGuard)
  // Specifying the content type makes the browser view the image
  // instead of automatically downloading it.
  @Header('Content-Type', 'image')
  async findOne(
    @Param('imagePath') imagePath: string,
    @CurrentUser() user: User,
  ) {
    return this.imagesService.findOne(imagePath, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles(new ParseFilePipe({ validators: fileValidators }))
    images: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    return this.imagesService.upload(images, user);
  }

  @Post(':imagePath/transform')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'image')
  async transform(
    @Param('imagePath') imagePath: string,
    @CurrentUser() user: User,
    @Body() transformImageDto: TransformImageDto,
  ) {
    // const image = await this.imagesService.findOne(imagePath, user);
    console.dir(transformImageDto.transformations);
    return 'Good transformations object';
    // return this.imageManipulationService.resize(image);
  }
}
