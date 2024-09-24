import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { encrypt } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService,  private jwtService: JwtService){}

    async logIn(email: string, contrasena: string){
        try {
            
            const user = await this.prismaService.usuarios.findUnique({
                where: {
                    email,
                },
            });

            if(!user){
                throw new BadRequestException('Email o Contraseña Invalido.');
            }

            const isPasswordMatch = await compare(contrasena, user.contrasena);

            if(!isPasswordMatch){
                throw new BadRequestException('Email o Contraseña Invalido.');
            }

            const {contrasena: _, ...userWithoutPassword} = user;

            const carga = {
                ...userWithoutPassword,
            }

            const token = await this.jwtService.signAsync(carga);

            return {token};
        } catch (error) {
            if(error instanceof BadRequestException){
                throw error;
            }

            throw new InternalServerErrorException('Error al Hacer Ingreso');
        }
    }

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

            const hashedPassword = await encrypt(contrasena);

            const user= await this.prismaService.usuarios.create({
                data: {
                    nombre,
                    email,
                    contrasena: hashedPassword,
                    telefono,
                    direccion,
                }
            });

            const {contrasena: _, ...userWithoutPassword}= user;

            const carga = {
                ...userWithoutPassword,
            }

            const token = await this.jwtService.signAsync(carga);

            return {token};
        } catch (error) {
            if(error instanceof BadRequestException){
                throw error;
            }
        throw new Error(error)
        }
    }
}
