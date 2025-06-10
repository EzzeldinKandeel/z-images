import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { NestMinioService } from 'nestjs-minio';
import { Express } from 'express';
import { Client, S3Error } from 'minio';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  private minioClient: Client;
  constructor(
    private nestMinioService: NestMinioService,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    this.minioClient = nestMinioService.getMinio();
  }

  async findOne(imagePath: string, user: User) {
    let imageRecord: Image | null;
    try {
      imageRecord = (
        await this.imageRepository.find({
          relations: { user: true }, // Includes the user in the image record.
          where: { path: imagePath },
          take: 1, // For super extra extreme clarity that we're returning ONE.
        })
      )[0];
    } catch {
      throw new HttpException(
        'Could not retrieve image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!imageRecord) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    if (imageRecord.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    try {
      const imageStream = await this.minioClient.getObject(
        'z-images',
        imagePath,
      );

      return new StreamableFile(imageStream);
    } catch (error) {
      if (error instanceof S3Error && error.code === 'NoSuchKey') {
        console.log('No image object');
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Could not retrieve image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upload(images: Array<Express.Multer.File>, user: User) {
    for (const image of images) {
      const imageObjectName = randomUUID();

      try {
        await this.minioClient.putObject(
          'z-images',
          `${imageObjectName}`,
          image.buffer,
          image.size,
          { 'Content-Type': image.mimetype },
        );
      } catch {
        // Something went wrong with uploading the image to storage.
        throw new HttpException(
          'Could not upload image(s)',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      try {
        const imageRecord = new Image();
        imageRecord.path = imageObjectName;
        imageRecord.user = user;
        await this.imageRepository.save(imageRecord);
      } catch {
        // Something went wrong with saving the image path in the database.
        // So, we delete the image from storage, then throw an http exception.

        // TODO: Delete image.

        throw new HttpException(
          'Could not upload image(s)',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
