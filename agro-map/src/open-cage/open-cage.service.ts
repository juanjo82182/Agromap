import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class OpenCageService {
  
  private readonly API_URL = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private readonly httpService: HttpService) {}

  geocodeAddress(address: string, city?: string): Observable<AxiosResponse<any>> {
    const apiKey = process.env.API_KEY1;  // Reemplaza con tu clave de API de OpenCage

    const fullAddress = city ? `${address}, ${city}, Colombia` : `${address}, Colombia`;

    const url = `${this.API_URL}?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
    
    return this.httpService.get(url).pipe(
      map(response => response.data)
    );
  }
}
