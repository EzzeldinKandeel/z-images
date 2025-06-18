import { Module } from '@nestjs/common';
import { JimpService } from './jimp.service';

@Module({
  providers: [JimpService],
  exports: [JimpService],
})
export class JimpModule {}
