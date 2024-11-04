import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleGeocodingService {
    private readonly API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private readonly httpService: HttpService) {}

  geocodeAddress(address: string, city?: string,postalCode?: string): Observable<any> {
    const apiKey = process.env.GOOGLE_API_KEY;
  
       // Formatear el address completo
       const fullAddress = postalCode ? `${address}, ${postalCode}, ${city}, Colombia` : `${address}, ${city}, Colombia`;

       // Construir los componentes solo con ciudad y país
       const components = [
           `locality:${encodeURIComponent(city)}`,
           `country:Colombia`
       ].join('|');

       // Incluir el parámetro region=CO en la URL
       const url = `${this.API_URL}?address=${encodeURIComponent(fullAddress)}&components=${components}&region=CO&key=${apiKey}`;

    return this.httpService.get(url).pipe(
      map(response => {
        const results = response.data.results;
        if (results.length === 0) {
          console.error('No se encontraron coordenadas para la dirección especificada.');
          throw new InternalServerErrorException('No se pudieron obtener las coordenadas para la dirección especificada.');
        }
        return results[0];
      }),
      catchError(err => {
        console.error('Error al llamar a Google Geocoding:', err);
        throw new InternalServerErrorException('Error al obtener coordenadas');
      }),
    );
  }


}
