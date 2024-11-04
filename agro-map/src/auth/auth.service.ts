import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { encrypt } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGeocodingService } from 'src/google-geocoding/google-geocoding.service';
import { ClimaRecomendacionesService } from 'src/clima-recomendaciones/clima-recomendaciones.service';
import { MailService } from 'src/mail/mail.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService,  private jwtService: JwtService,private readonly googleGeocodeService: GoogleGeocodingService, private readonly climaRecomendacionesService: ClimaRecomendacionesService,private mailService: MailService,){}

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
                id_usuario: user.id_usuario,
                ...userWithoutPassword,
            }      

            const token = await this.jwtService.signAsync(carga);

            // Desencadenar la lógica de clima y recomendaciones de manera asíncrona
            const { direccion, ciudad, codigo_postal } = user;
            const coordinates = await firstValueFrom(this.googleGeocodeService.geocodeAddress(direccion, ciudad, codigo_postal));
             if (!coordinates) {
               throw new InternalServerErrorException('No se pudieron obtener las coordenadas.');
            }

            const { lat, lng } = coordinates.geometry.location;
             this.climaRecomendacionesService.obtenerClimaYRecomendaciones(lat, lng, user.id_usuario, this.prismaService);

    
            return {token, userId: user.id_usuario};
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

    async signUp(nombre: string, email: string, contrasena: string, telefono: string, direccion: string, ciudad: string,codigo_postal: string) {
        try {
            const userFound = await this.prismaService.usuarios.findUnique({
                where: { email },
            });
            if (userFound) throw new BadRequestException('El usuario ya existe');
            const hashedPassword = await encrypt(contrasena);
            await this.prismaService.usuarios.create({
                data: {
                    nombre,
                    email,
                    contrasena: hashedPassword,
                    telefono,
                    direccion,
                    ciudad,
                    codigo_postal,
                }
            });
            return { message: 'Usuario creado exitosamente' };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error al crear usuario');
        }
    }

   // Enviar código de restablecimiento
   async enviarCodigoRestablecimiento(email: string) {
    const usuario = await this.prismaService.usuarios.findUnique({ where: { email } });
    if (!usuario) throw new BadRequestException('Usuario no encontrado.');

    await this.mailService.enviarEmailRestablecimiento(email);
    return { mensaje: 'Código enviado con éxito.' };
}

// Verificar el código y generar JWT si es válido
async verificarCodigo(email: string, codigo: string) {
    const esValido = this.mailService.verificarCodigo(email, codigo);
    if (!esValido) throw new BadRequestException('Código de restablecimiento incorrecto.');

    const token = await this.jwtService.signAsync({ email }, { secret: process.env.SECRET, expiresIn: '15m' });
    this.mailService.resetearCodigo(email);
    return { token }; // Retorna el JWT
}

// Restablecer contraseña usando el JWT
async restablecerContrasena(token: string, nuevaContrasena: string) {
    try {
        const payload = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
        const usuario = await this.prismaService.usuarios.findUnique({ where: { email: payload.email } });
        if (!usuario) throw new BadRequestException('Token inválido.');

        const contrasenaHashed = await encrypt(nuevaContrasena);
        await this.prismaService.usuarios.update({
            where: { email: payload.email },
            data: { contrasena: contrasenaHashed },
        });
        return { mensaje: 'Contraseña restablecida con éxito.' };
    } catch (error) {
        console.error('Error al verificar el token:', error);
        throw new InternalServerErrorException('Error al restablecer contraseña.');
    }
}

}


