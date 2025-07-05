import { Injectable, StreamableFile } from '@nestjs/common';
import { ImagesService } from '../images.service';
import { readCompleteBuffer } from 'src/utils/read-complete-buffer';
import { Jimp } from 'jimp';

@Injectable()
export class ImageManipulationService {
  constructor(private imagesService: ImagesService) {}
  async resize(image: StreamableFile) {
    const imageBuffer = await readCompleteBuffer(image.getStream());
    const imageObj = await Jimp.read(imageBuffer);
    const editedImageObj = imageObj.rotate(90);
    const editedImage = await editedImageObj.getBuffer(
      image.getHeaders().type as any,
    );
    return new StreamableFile(editedImage);
  }
}
