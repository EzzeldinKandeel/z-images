import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { ImageFormat, MimeType } from './utils.types';

@Injectable()
export class UtilsService {
  async readCompleteBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (data: Buffer) => {
        chunks.push(data);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      stream.on('error', reject);
    });
  }

  mimeToFormat(mime: MimeType): ImageFormat {
    return mime.slice(6) as ImageFormat;
  }

  formatToMime(imageFormat: ImageFormat): MimeType {
    return `image/${imageFormat}`;
  }
}
