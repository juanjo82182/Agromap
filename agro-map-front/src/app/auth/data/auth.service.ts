import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {tap} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { StorageService } from "../../shared/data/storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private _http = inject(HttpClient);
    private _storage = inject(StorageService);

    constructor(){}

    signUp(nombre: string, email: string, contrasena: string, telefono: string, direccion: string, ciudad: string): Observable<any>{
        return this._http.post(`${environment.API_URL}/auth/sign-up`,{nombre, email, contrasena, telefono, direccion, ciudad}).pipe(tap((response) => {
            this._storage.set('session', JSON.stringify(response))
        } ));
    }

    logIn(email: string, contrasena: string): Observable<any>{
        return this._http.post(`${environment.API_URL}/auth/log-in`,{email, contrasena}).pipe(tap((response) => {
            this._storage.set('session', JSON.stringify(response))
        } ));
    }
   
}