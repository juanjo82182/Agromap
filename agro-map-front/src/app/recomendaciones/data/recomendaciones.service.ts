import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {tap} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { StorageService } from "../../shared/data/storage.service";

interface Session{
    token: string;
    userId: number;
  }

@Injectable({
    providedIn: 'root'
})
export class RecomendacionesService{

    private _http = inject(HttpClient);
    private _storage = inject(StorageService);

    constructor(){}

    // Método para obtener el clima y recomendaciones del backend
    getClimaRecomendaciones(): Observable<any> {
        const session = this._storage.get<Session>('session');
        const token = session ? session.token : null;
        const usuarioId = session ? session.userId : null;

        if (!token || !usuarioId) {
            throw new Error("Usuario no encontrado en la sesión.");
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this._http.get(`${environment.API_URL}/clima/ultimo?usuarioId=${usuarioId}`, { headers });
    }

   
}