import { Injectable } from '@nestjs/common';
import { NestMinioService } from 'nestjs-minio';
import { Express } from 'express';
import { Client } from 'minio';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesService {
  private minioClient: Client;
  constructor(private nestMinioService: NestMinioService) {
    this.minioClient = nestMinioService.getMinio();
  }

  async findOne(imagePath: string) {
    const image = await this.minioClient.getObject('z-images', imagePath);
  }

  async upload(images: Array<Express.Multer.File>) {
    for (const image of images) {
      // This gets the image format from the original file name.
      const fileFormat = image.originalname.substring(
        image.originalname.lastIndexOf('.') + 1,
      );
      console.log(image);
      const result = await this.minioClient.putObject(
        'z-images',
        `${randomUUID()}.${fileFormat}`,
        image.buffer,
        image.size,
        { 'Content-Type': image.mimetype },
      );

      console.log(result);
    }
  }
}
