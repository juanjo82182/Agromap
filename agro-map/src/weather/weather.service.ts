import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
  private readonly Api_Key2 = process.env.API_KEY2; 
  private readonly apiUrl = 'http://api.weatherapi.com/v1/current.json';

  constructor(private readonly httpService: HttpService) {}

  getWeatherByCoordinates(dmsLat: string, dmsLng: string): Observable<any> {
    try {
      const lat = convertDMSToDecimal(dmsLat);  // Convierte la latitud a decimal
      const lon = convertDMSToDecimal(dmsLng);  // Convierte la longitud a decimal

      const url = `${this.apiUrl}?key=${this.Api_Key2}&q=${lat},${lon}`;

      return this.httpService.get(url).pipe(
        map(response => response.data)
      );
    } catch (error) {
      throw new Error('Error converting DMS to Decimal: ' + error.message);
    }
  }
}

function convertDMSToDecimal(dms: string): number {
  const dmsParts = dms.split(/[^\d\w.]+/);  // Dividir por cualquier cosa que no sea un número, letra o punto
  if (dmsParts.length < 4) {
      throw new Error(`Invalid DMS format: ${dms}`);
  }
  const degrees = parseFloat(dmsParts[0]);
  const minutes = parseFloat(dmsParts[1]);
  const seconds = parseFloat(dmsParts[2]);
  const direction = dmsParts[3];

  let decimal = degrees + minutes / 60 + seconds / 3600;

  // Si la dirección es Sur (S) o Oeste (W), el número es negativo
  if (direction === 'S' || direction === 'W') {
      decimal *= -1;
  }

  return decimal;
}