import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    constructor(private _http: HttpClient){}

    signUp(nombre: string, email: string, contrasena: string, telefono: string, direccion: string): Observable<any>{
        return this._http.post(`${environment.API_URL}/auth/sign-up`,{nombre, email, contrasena, telefono, direccion});
    }

    logIn(){}
}