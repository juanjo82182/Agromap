import { Test, TestingModule } from '@nestjs/testing';
import { OpenCageService } from './open-cage.service';

describe('OpenCageService', () => {
  let service: OpenCageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenCageService],
    }).compile();

    service = module.get<OpenCageService>(OpenCageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
