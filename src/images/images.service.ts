import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { NestMinioService } from 'nestjs-minio';
import { Express } from 'express';
import { Client, S3Error } from 'minio';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesService {
  private minioClient: Client;
  constructor(private nestMinioService: NestMinioService) {
    this.minioClient = nestMinioService.getMinio();
  }

  async findOne(imagePath: string) {
    try {
      const imageStream = await this.minioClient.getObject(
        'z-images',
        imagePath,
      );

      return new StreamableFile(imageStream);
    } catch (error) {
      if (error instanceof S3Error && error.code === 'NoSuchKey') {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Could not retrieve image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upload(images: Array<Express.Multer.File>) {
    for (const image of images) {
      // This gets the image format from the original file name.
      const fileFormat = image.originalname.substring(
        image.originalname.lastIndexOf('.') + 1,
      );

      try {
        await this.minioClient.putObject(
          'z-images',
          `${randomUUID()}.${fileFormat}`,
          image.buffer,
          image.size,
          { 'Content-Type': image.mimetype },
        );
      } catch {
        throw new HttpException(
          'Could not upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
