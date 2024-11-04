import { Test, TestingModule } from '@nestjs/testing';
import { ClimaRecomendacionesService } from './clima-recomendaciones.service';

describe('ClimaRecomendacionesService', () => {
  let service: ClimaRecomendacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClimaRecomendacionesService],
    }).compile();

    service = module.get<ClimaRecomendacionesService>(ClimaRecomendacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
