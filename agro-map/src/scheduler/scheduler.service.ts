import { Injectable } from '@nestjs/common';
import * as Cron from 'node-cron';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGeocodingService } from 'src/google-geocoding/google-geocoding.service';
import { ClimaRecomendacionesService } from 'src/clima-recomendaciones/clima-recomendaciones.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly googleGeocodeService: GoogleGeocodingService,
        private readonly climaRecomendacionesService: ClimaRecomendacionesService,
      ) {
        // Programar la tarea para que se ejecute cada 12 horas
        Cron.schedule('0 */12 * * *', async () => {
          await this.updateWeatherAndRecommendations();
        });
        this.updateWeatherAndRecommendations();
      }
    
      private async updateWeatherAndRecommendations() {
        console.log('Ejecutando tarea programada para actualizar clima y recomendaciones');
    
        const users = await this.prismaService.usuarios.findMany();
    
        for (const user of users) {
          const { direccion, ciudad, id_usuario } = user;
          const coordinates = await firstValueFrom(this.googleGeocodeService.geocodeAddress(direccion, ciudad));
    
          if (!coordinates) {
            console.error('No se pudieron obtener las coordenadas para el usuario:', id_usuario);
            continue;
          }
    
          const { lat, lng } = coordinates.geometry.location;
          await this.climaRecomendacionesService.obtenerClimaYRecomendaciones(lat, lng, id_usuario, this.prismaService);
        }
      }
}
