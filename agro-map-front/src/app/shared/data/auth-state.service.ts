import { inject, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

interface Session {
    token: string;
    userId: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthStateService{
    private _storageService = inject(StorageService);

    signOut(){
        this._storageService.remove('session');
    }

    getSession(): Session | null {
        let currentSession: Session | null = null;
        const maybeSession = this._storageService.get<Session>('session');
        if (maybeSession !== null) {
            if (this._isValidSession(maybeSession)) {
                currentSession = maybeSession;
            } else {
                this.signOut();
            }
        }
        return currentSession;
    }

    private _isValidSession(maybeSession: unknown): boolean {
        return (
            typeof maybeSession === 'object' && maybeSession !== null && 'token' in maybeSession && 'userId' in maybeSession
        );
    }
}