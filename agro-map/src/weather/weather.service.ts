import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
  private readonly Api_Key2 = process.env.API_KEY2; 
  private readonly apiUrl = 'http://api.weatherapi.com/v1/current.json';

  constructor(private readonly httpService: HttpService) {}

  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}?key=${this.Api_Key2}&q=${lat},${lon}`;
    
    return this.httpService.get(url).pipe(
      map(response => response.data)
    );
  }
}