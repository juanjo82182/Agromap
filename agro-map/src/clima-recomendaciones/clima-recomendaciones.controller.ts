import { Controller } from '@nestjs/common';
import { ClimaRecomendacionesService } from './clima-recomendaciones.service';

@Controller('clima-recomendaciones')
export class ClimaRecomendacionesController {
  constructor(private readonly climaRecomendacionesService: ClimaRecomendacionesService) {}
}
