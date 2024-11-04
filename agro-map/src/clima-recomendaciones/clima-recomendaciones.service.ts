import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WeatherService } from 'src/weather/weather.service';
import { IaService } from 'src/ia/ia.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClimaRecomendacionesService {
    constructor(
        private readonly weatherService: WeatherService,
        private readonly iaService: IaService,
      ) {}
    
      async obtenerClimaYRecomendaciones(lat: number, lng: number, usuarioId: number, prismaService): Promise<void> {
        try {
          const climaData = await firstValueFrom(this.weatherService.getWeatherByCoordinates(lat, lng));
          if (!climaData.current) {
            throw new InternalServerErrorException('No se pudo obtener la información climática.');
          }
    
          // Guardar datos de clima en la base de datos y obtener recomendación
          const datos = {
            temperatura: climaData.current.temp_c,
            humedad: climaData.current.humidity,
            viento: climaData.current.wind_kph,
            presion: climaData.current.pressure_mb,
            precipitacion: climaData.current.precip_mm,
          };
    
          const recomendacion = await this.iaService.ejecutarModelo(datos);
          const cultivoRecomendado = typeof recomendacion === 'string' ? recomendacion : recomendacion.recommendation;
    

          // Guardar datos de clima en la base de datos
          await prismaService.clima.create({
            data: {
              usuario_id: usuarioId,
              temperatura: climaData.current.temp_c,
              condicion: climaData.current.condition.text,
              humedad: climaData.current.humidity,
              viento: climaData.current.wind_kph,
              presion: climaData.current.pressure_mb,
              visibilidad: climaData.current.vis_km,
              precipitacion: climaData.current.precip_mm,
              recomendacion: cultivoRecomendado.toString(),
            }
          });
        } catch (error) {
          console.error('Error al obtener datos climáticos:', error);
          throw new InternalServerErrorException('Error al obtener información climática.');
        }
      }
}
