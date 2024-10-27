import { Test, TestingModule } from '@nestjs/testing';
import { OpenCageController } from './open-cage.controller';
import { OpenCageService } from './open-cage.service';

describe('OpenCageController', () => {
  let controller: OpenCageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenCageController],
      providers: [OpenCageService],
    }).compile();

    controller = module.get<OpenCageController>(OpenCageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
