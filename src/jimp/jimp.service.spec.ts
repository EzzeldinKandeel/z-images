import { Test, TestingModule } from '@nestjs/testing';
import { JimpService } from './jimp.service';

describe('JimpService', () => {
  let service: JimpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JimpService],
    }).compile();

    service = module.get<JimpService>(JimpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
