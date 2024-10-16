import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Request} from 'express';
import { Observable } from "rxjs";



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    async CanActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        console.log({token});

        if(!token){
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET,});

            console.log({payload});
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractToken(request: Request): string |  undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type == 'bearer' ? token : undefined;
    }
}