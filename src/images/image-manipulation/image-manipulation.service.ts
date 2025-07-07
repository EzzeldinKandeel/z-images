import { HttpException, Injectable, StreamableFile } from '@nestjs/common';
import { ImagesService } from '../images.service';
import { readCompleteBuffer } from 'src/utils/read-complete-buffer';
import { Jimp } from 'jimp';
import { Transformations } from './dto/transform-image.dto';

type MimeType =
  | 'image/x-ms-bmp'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/tiff';

@Injectable()
export class ImageManipulationService {
  constructor(private imagesService: ImagesService) {}

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

  private async getBufferAndStream(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    mime: MimeType,
  ) {
    const imageBuffer = await image.getBuffer(mime);
    return new StreamableFile(imageBuffer);
  }

  private rotate(
    image: Awaited<ReturnType<typeof this.makeJimp>>,
    degree: number,
  ) {
    return image.rotate(degree);
  }

  async transform(
    image: StreamableFile,
    transformations: Transformations,
  ): Promise<StreamableFile> {
    let imageJimp = await this.makeJimp(image);

    for (const transformation in transformations) {
      if (transformations[transformation]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        imageJimp = this[transformation](
          imageJimp,
          transformations[transformation],
        ) as typeof imageJimp;
      }
    }

    return this.getBufferAndStream(
      imageJimp,
      image.getHeaders().type as MimeType,
    );
  }
}
