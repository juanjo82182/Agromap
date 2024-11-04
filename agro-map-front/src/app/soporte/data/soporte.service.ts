import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SoporteService {
  private http = inject(HttpClient);

  sendSupportEmail(data: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/soporte/email`, data);
  }
}