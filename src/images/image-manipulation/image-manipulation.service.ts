import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Jimp, JimpInstance } from 'jimp';
import { Transformations } from './dto/transform-image.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UtilsService } from 'src/utils/utils.service';
import { MimeType } from 'src/utils/utils.types';

@Injectable()
export class ImageManipulationService {
  constructor(
    @InjectQueue('imageManipulation')
    private readonly imageManipulationQueue: Queue,
    private readonly utilsService: UtilsService,
  ) {}

  async transform(
    image: StreamableFile,
    transformations: Transformations,
  ): Promise<{ imageBuffer: Buffer; mimeType: MimeType }> {
    // We do this because the image format (more specifically its mime type)
    // is needed when converting from Jimp object to buffer.
    if (!transformations.format) {
      transformations.format = this.utilsService.mimeToFormat(
        image.getHeaders().type as MimeType,
      );
    }
    const imageBuffer = await this.utilsService.readCompleteBuffer(
      image.getStream(),
    );
    for (const transformation in transformations) {
      if (transformations[transformation]) {
      }
    }

    // If the user did not specify an image format, the image will be exported
    // in its original format.
    const mime = (
      format ? `image/${format}` : image.getHeaders().type
    ) as MimeType;

    return { imageBuffer: await imageJimp.getBuffer(mime), mimeType: mime };
  }

  // private async makeJimp(image: StreamableFile): Promise<JimpInstance> {
  //   try {
  //     const imageBuffer = await readCompleteBuffer(image.getStream());
  //     const imageJimp = (await Jimp.read(imageBuffer)) as JimpInstance;
  //     console.log(imageJimp.mime);
  //
  //     return imageJimp;
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException('Something went wrong', 500);
  //   }
  // }

  private async bufferToJimp(imageBuffer: Buffer): Promise<JimpInstance> {
    try {
      const imageJimp = (await Jimp.read(imageBuffer)) as JimpInstance;
      return imageJimp;
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  private async jimpToBuffer(imageJimp: JimpInstance): Promise<Buffer> {
    try {
      const imageBuffer = await imageJimp.getBuffer(imageJimp.mime as MimeType);
      return imageBuffer;
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  private applyTransformation(
    transformationType: keyof Transformations,
    image: JimpInstance,
    options: object | number,
  ): JimpInstance {
    switch (transformationType) {
      case 'crop':
        return this.crop(image, options as Transformations['crop']);
      case 'filters':
        return this.filters(image, options as Transformations['filters']);
      case 'flip':
        return this.flip(image, options as Transformations['flip']);
      case 'resize':
        return this.resize(image, options as Transformations['resize']);
      case 'rotate':
        return this.rotate(image, options as Transformations['rotate']);
      default:
        return image;
    }
  }

  private resize(
    image: JimpInstance,
    options: Transformations['resize'],
  ): JimpInstance {
    const resizeOptions = { w: options.width, h: options.height };

    if (!resizeOptions.h && !resizeOptions.w)
      throw new HttpException(
        'You have to provide (width) and/or (height) to resize image',
        HttpStatus.BAD_REQUEST,
      );
    return image.resize(resizeOptions) as JimpInstance;
  }

  private crop(
    image: JimpInstance,
    options: Transformations['crop'],
  ): JimpInstance {
    return image.crop({
      x: options.x,
      y: options.y,
      w: options.width,
      h: options.hight,
    }) as JimpInstance;
  }

  private rotate(
    image: JimpInstance,
    degree: Transformations['rotate'],
  ): JimpInstance {
    return image.rotate(degree) as JimpInstance;
  }

  private flip(
    image: JimpInstance,
    options: Transformations['flip'],
  ): JimpInstance {
    return image.flip({
      horizontal: options.horizontal,
      vertical: options.vertical,
    }) as JimpInstance;
  }

  private filters(
    image: JimpInstance,
    filters: Transformations['filters'],
  ): JimpInstance {
    for (const filter in filters) {
      if (filters[filter]) {
        if (typeof filters[filter] === 'number')
          image[filter as keyof Transformations['filters']](filters[filter]);
        else image[filter as keyof Transformations['filters']]();
      }
    }

    return image;
  }
}
