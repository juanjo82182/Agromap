import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService){}

    async getUsers(){
        return await this.prismaService.usuarios.findMany();
    }

    async signUp(nombre: string, email: string, contrasena: string, telefono?: string, direccion?: string){
        try {
            const userFound = await this.prismaService.usuarios.findUnique({
                where: {
                    email,
                },
            });

            if(userFound) throw new BadRequestException('El usuario ya existe');

            const user= await this.prismaService.usuarios.create({
                data: {
                    nombre,
                    email,
                    contrasena,
                    telefono,
                    direccion,
                }
            });
            return user;
        } catch (error) {
            if(error instanceof BadRequestException){
                throw error;
            }
        throw new Error(error)
        }
    }
}
