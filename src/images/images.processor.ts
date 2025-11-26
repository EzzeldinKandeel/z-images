import { SandboxedJob } from 'bullmq';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Jimp, JimpInstance } from 'jimp';
import { UtilsService } from 'src/utils/utils.service';
import { ImageJobData } from './images.service';

export default async function process(
  job: SandboxedJob<ImageJobData, any>,
): Promise<any> {
  const utilsService = new UtilsService();
  const transformations = job.data.transformations;

  // Bullmq changes the shape of buffers to:
  // {
  //  type: 'Buffer';
  //  data: Array<>;
  // }
  // whenever they are passed to or from the main thread,
  // because they are stringified.
  // So we have to recreate the buffer from the data array.
  const imageBuffer = Buffer.from(
    (
      job.data.imageBuffer as unknown as {
        type: 'Buffer';
        data: Uint8Array;
      }
    ).data,
  );

  const imageJimp = (await Jimp.fromBuffer(imageBuffer)) as JimpInstance;

  for (const transformation in transformations) {
    switch (transformation) {
      case 'resize':
        if (!transformations.resize.height && !transformations.resize.width)
          throw new HttpException(
            'You have to provide (width) and/or (height) to resize image',
            HttpStatus.BAD_REQUEST,
          );

        imageJimp.resize({
          h: transformations.resize.height,
          w: transformations.resize.width,
        });
        break;
      case 'crop':
        imageJimp.crop({
          x: transformations.crop.x,
          y: transformations.crop.y,
          h: transformations.crop.height,
          w: transformations.crop.width,
        });
        break;
      case 'rotate':
        imageJimp.rotate(transformations.rotate);
        break;
      case 'flip':
        imageJimp.flip({
          horizontal: transformations.flip.horizontal,
          vertical: transformations.flip.vertical,
        });
        break;
      case 'filters':
        for (const filter in transformations.filters) {
          switch (filter) {
            case 'blur':
              if (transformations.filters.blur > 0) {
                imageJimp.blur(transformations.filters.blur);
              }
              break;
            case 'dither':
              if (transformations.filters.dither) {
                imageJimp.dither();
              }
              break;
            case 'fisheye':
              if (transformations.filters.fisheye) {
                imageJimp.fisheye();
              }
              break;
            case 'greyscale':
              if (transformations.filters.greyscale) {
                imageJimp.greyscale();
              }
              break;
            case 'invert':
              if (transformations.filters.invert) {
                imageJimp.invert();
              }
              break;
            case 'pixelate':
              if (transformations.filters.pixelate > 0) {
                imageJimp.pixelate(transformations.filters.pixelate);
              }
              break;
            case 'sepia':
              if (transformations.filters.sepia) {
                imageJimp.sepia();
              }
              break;
            default:
              break;
          }
        }
        break;
      default:
        break;
    }
  }

  const manipulatedImageBuffer = await imageJimp.getBuffer(
    utilsService.formatToMime(transformations.format),
  );

  return manipulatedImageBuffer;
}
