import { Test, TestingModule } from '@nestjs/testing';
import { ClimaRecomendacionesController } from './clima-recomendaciones.controller';
import { ClimaRecomendacionesService } from './clima-recomendaciones.service';

describe('ClimaRecomendacionesController', () => {
  let controller: ClimaRecomendacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClimaRecomendacionesController],
      providers: [ClimaRecomendacionesService],
    }).compile();

    controller = module.get<ClimaRecomendacionesController>(ClimaRecomendacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
