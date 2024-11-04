import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGeocodingService } from 'src/google-geocoding/google-geocoding.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClimaService {
  constructor(private prismaService: PrismaService,private readonly googleGeocodeService: GoogleGeocodingService) {}

  async getLastClimaRecordByUserId(usuario_id: number) {
    const lastRecord = await this.prismaService.clima.findFirst({
        where: { usuario_id: usuario_id },
        orderBy: { fechaCreacion: 'desc' },
        include: {
            usuarios: {  // asegurate de que sea 'usuario' y no 'usuarios'
                select: {
                    direccion: true,
                    ciudad: true,
                    codigo_postal: true,  // Incluye codigo_postal si es necesario
                },
            },
        },
    });

    if (!lastRecord) {
      console.log('No se encontraron registros de clima para este usuario:', usuario_id);
      throw new NotFoundException('No se encontraron registros de clima para este usuario.');
    }

    // Obtener coordenadas basadas en la dirección, ciudad y código postal del usuario
    const { direccion, ciudad, codigo_postal } = lastRecord.usuarios;
    const coordinates = await firstValueFrom(this.googleGeocodeService.geocodeAddress(direccion, ciudad, codigo_postal));

    if (!coordinates) {
      throw new InternalServerErrorException('No se pudieron obtener las coordenadas.');
    }

    const { lat, lng } = coordinates.geometry.location;

    // Incluir coordenadas en la respuesta
    return {
      ...lastRecord,
      latitud: lat,
      longitud: lng,
    };
  }
}