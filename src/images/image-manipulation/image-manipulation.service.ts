import { Injectable, StreamableFile } from '@nestjs/common';
import { ImagesService } from '../images.service';
import { Jimp } from 'jimp';
import { readCompleteBuffer } from 'src/utils/read-complete-buffer';

@Injectable()
export class ImageManipulationService {
  constructor(private imagesService: ImagesService) {}
  async resize(image: StreamableFile) {
    const imageBuffer = await readCompleteBuffer(image.getStream());
    const jImage = await Jimp.fromBuffer(imageBuffer);
    const editedJImage = jImage.rotate(90);
    const editedImageBuffer = await editedJImage.getBuffer('image/jpeg');
    return new StreamableFile(editedImageBuffer);
  }
}
