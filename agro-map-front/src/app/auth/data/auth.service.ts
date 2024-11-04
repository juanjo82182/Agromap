import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {tap} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { StorageService } from "../../shared/data/storage.service";

interface AuthResponse {
    token: string;
    userId: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private _http = inject(HttpClient);
    private _storage = inject(StorageService);

    constructor(){}

    signUp(nombre: string, email: string, contrasena: string, telefono: string, direccion: string, ciudad: string, codigo_postal: string): Observable<any>{
        return this._http.post(`${environment.API_URL}/auth/sign-up`,{nombre, email, contrasena, telefono, direccion, ciudad, codigo_postal});
    }

    logIn(email: string, contrasena: string): Observable<AuthResponse> {
        return this._http.post<AuthResponse>(`${environment.API_URL}/auth/log-in`, { email, contrasena }).pipe(
            tap((response: AuthResponse) => {
                console.log('Session:', response);
                this._storage.set('session', JSON.stringify(response));
            })
        );
    }

    enviarCodigoRestablecimiento(email: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/auth/enviar-codigo-restablecimiento`, { email });
      }
    
      verificarCodigo(email: string, codigo: string): Observable<{ token: string }> { // Cambiado para incluir el email
        return this._http.post<{ token: string }>(`${environment.API_URL}/auth/verificar-codigo`, { email, codigo });
      }
    
      restablecerContrasena(token: string, nuevaContrasena: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/auth/restablecer-contrasena`, { token, nuevaContrasena });
      }
   
}