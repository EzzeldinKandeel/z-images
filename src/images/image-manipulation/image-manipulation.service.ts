import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ImagesService, MimeType } from '../images.service';
import { readCompleteBuffer } from 'src/utils/read-complete-buffer';
import { Jimp } from 'jimp';
import { Transformations } from './dto/transform-image.dto';

@Injectable()
export class ImageManipulationService {
  constructor(private imagesService: ImagesService) {}

  async transform(
    image: StreamableFile,
    transformations: Transformations,
  ): Promise<{ imageBuffer: Buffer; mimeType: MimeType }> {
    let imageJimp = await this.makeJimp(image);

    // We do this because format is not like any other transformation,
    // and should only be considered at the very end (after all other
    // transformations have been applied).
    const { format, ...restOfTransformations } = transformations;

    for (const transformation in restOfTransformations) {
      if (transformations[transformation]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        imageJimp = this[transformation](
          imageJimp,
          transformations[transformation],
        ) as typeof imageJimp;
      }
    }

    // If the user did not specify an image format, the image will be exported
    // in its original format.
    const mime = (
      format ? `image/${format}` : image.getHeaders().type
    ) as MimeType;

    return { imageBuffer: await imageJimp.getBuffer(mime), mimeType: mime };
  }

  private async makeJimp(image: StreamableFile) {
    try {
      const imageBuffer = await readCompleteBuffer(image.getStream());
      const imageJimp = await Jimp.read(imageBuffer);

      return imageJimp;
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  private resize(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    options: Transformations['resize'],
  ) {
    type ResizeOptions = { w: number; h?: number } | { w?: number; h: number };

    const resizeOptions: { w?: number; h?: number } = {};
    if (options.width) resizeOptions.w = options.width;
    if (options.height) resizeOptions.h = options.height;

    if (!resizeOptions.h && !resizeOptions.w) return image;

    return image.resize(resizeOptions as ResizeOptions);
  }

  private crop(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    options: Transformations['crop'],
  ) {
    return image.crop({
      x: options.x,
      y: options.y,
      w: options.width,
      h: options.hight,
    });
  }

  private rotate(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    degree: Transformations['rotate'],
  ) {
    return image.rotate(degree);
  }

  private flip(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    options: Transformations['flip'],
  ) {
    return image.flip({
      horizontal: options.horizontal,
      vertical: options.vertical,
    });
  }

  private effect(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    options: Transformations['effect'],
  ) {
    // We don't need to break at the end of every case, because return
    // exits the function completely.
    switch (options) {
      case 'blur':
        return image.blur(10);
      case 'dither':
        return image.dither();
      case 'fisheye':
        return image.fisheye();
      case 'greyscale':
        return image.greyscale();
      case 'invert':
        return image.invert();
      case 'pixelate':
        return image.pixelate(10);
      case 'sepia':
        return image.sepia();
      default:
        throw new HttpException(
          'Invalid effect option',
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}

// A note about the repetitive use of Awaited<ReturnType<typeof this.makeJimp>>:
// Idealy, Jimp objects would have a consistent exposed type. But unfortunately,
// that is not the case.
