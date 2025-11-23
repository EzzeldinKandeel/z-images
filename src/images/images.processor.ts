import { ImageJobData } from './image-manipulation/image-manipulation.service';
import { SandboxedJob } from 'bullmq';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Jimp, JimpInstance } from 'jimp';
import { Transformations } from './image-manipulation/dto/transform-image.dto';
import { UtilsService } from 'src/utils/utils.service';

export default async function process(
  job: SandboxedJob<ImageJobData, any>,
): Promise<any> {
  const utilsService = new UtilsService();
  const { imageBuffer, transformations } = job.data;

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
          h: transformations.crop.hight,
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
        for (const filter in transformations) {
          if (transformation[filter]) {
            if (typeof transformation[filter] === 'number')
              imageJimp[filter as keyof Transformations['filters']](
                transformation[filter],
              );
            else imageJimp[filter as keyof Transformations['filters']]();
          }
        }
        break;
      default:
        break;
    }
  }

  const manipulatedImageBuffer = imageJimp.getBuffer(
    utilsService.formatToMime(transformations.format),
  );

  return manipulatedImageBuffer;
}
