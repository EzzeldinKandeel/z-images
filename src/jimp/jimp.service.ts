import { Injectable } from '@nestjs/common';
import { Jimp } from 'jimp';

@Injectable()
export class JimpService extends Jimp {}
