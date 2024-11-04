import { Module } from '@nestjs/common';
import { ClimaRecomendacionesService } from './clima-recomendaciones.service';
import { ClimaRecomendacionesController } from './clima-recomendaciones.controller';
import { IaModule } from 'src/ia/ia.module';
import { WeatherModule } from 'src/weather/weather.module';
@Module({
  imports:[IaModule,WeatherModule],
  controllers: [ClimaRecomendacionesController],
  providers: [ClimaRecomendacionesService],
  exports: [ClimaRecomendacionesService],
})
export class ClimaRecomendacionesModule {}
