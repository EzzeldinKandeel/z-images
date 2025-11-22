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
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/env.validation';
import { MimeType } from 'src/utils/utils.types';

export type ImageData = { url: string; mimeType: MimeType };

@Injectable()
export class ImagesService {
  private minioClient: Client;
  constructor(
    private nestMinioService: NestMinioService,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.minioClient = nestMinioService.getMinio();

    this.minioClient
      .bucketExists('z-images')
      .then((exists: boolean) => {
        if (!exists) {
          this.minioClient
            .makeBucket('z-images')
            .then(() => {
              console.log('Minio: Object storage bucket created successfully');
            })
            .catch((error) => {
              console.error('Could not create object storage bucket');
              throw error;
            });
        }
      })
      .catch((error) => {
        console.error('Could not check object storage bucket existence');
        throw error;
      });
  }

  async findOne(imagePath: string, user: User): Promise<StreamableFile> {
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

      return new StreamableFile(imageStream, { type: imageRecord.mimetype });
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

  async upload(
    images: Array<Express.Multer.File>,
    user: User,
  ): Promise<Array<ImageData>> {
    const imageDataArray: Array<ImageData> = [];

    for (const image of images) {
      imageDataArray.push(
        await this.uploadSingleImage(
          image.buffer,
          image.mimetype as MimeType,
          user,
        ),
      );
    }

    return imageDataArray;
  }

  async uploadSingleImage(
    imageBuffer: Buffer,
    mimeType: MimeType,
    imageOwner: User,
  ): Promise<ImageData> {
    const imageObjectName = await this.storeImage(imageBuffer, mimeType);
    await this.createImageRecord(imageObjectName, mimeType, imageOwner);

    return {
      url: `${this.configService.getOrThrow('DOMAIN_NAME')}/images/${imageObjectName}`,
      mimeType,
    };
  }

  private async storeImage(
    imageBuffer: Buffer,
    mimeType: MimeType,
  ): Promise<string> {
    const imageObjectName = randomUUID();

    try {
      await this.minioClient.putObject(
        'z-images',
        `${imageObjectName}`,
        imageBuffer,
        undefined,
        { 'Content-Type': mimeType },
      );
    } catch (error) {
      console.error('Could not store image in object storage', error);
      throw new HttpException(
        'Could not upload image(s)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return imageObjectName;
  }

  private async createImageRecord(
    imageObjectName: string,
    mimeType: MimeType,
    imageOwner: User,
  ): Promise<void> {
    try {
      const imageRecord = new Image();
      imageRecord.path = imageObjectName;
      imageRecord.mimetype = mimeType;
      imageRecord.user = imageOwner;
      await this.imageRepository.save(imageRecord);
    } catch (error) {
      // Something went wrong with saving the image path in the database.
      // So, we delete the image from storage, then throw an http exception.
      console.error('Could not create a record for image in database', error);
      console.log('Attempting deletion of image from object storage...');

      try {
        await this.minioClient.removeObject('z-images', imageObjectName);
        console.log('Image deletion successful');
      } catch (error) {
        console.error('Could not delete image from object storage', error);
      }

      throw new HttpException(
        'Could not upload image(s)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
