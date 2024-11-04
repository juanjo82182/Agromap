import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

interface UserDTO{
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() user: UserDTO){
    return this.authService.logIn(user.email,user.contrasena);
  }

  @UseGuards(AuthGuard)
  @Get('users')
  getUsers(){
    return this.authService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() user: UserDTO){
    return this.authService.signUp(user.nombre,user.email,user.contrasena,user.telefono,user.direccion,user.ciudad,user.codigo_postal);
  }

// Enviar código de restablecimiento de contraseña
@HttpCode(HttpStatus.OK)
@Post('enviar-codigo-restablecimiento')
enviarCodigoRestablecimiento(@Body('email') email: string) {
    return this.authService.enviarCodigoRestablecimiento(email);
}

// Verificar código y obtener JWT
@HttpCode(HttpStatus.OK)
@Post('verificar-codigo')
async verificarCodigo(
    @Body('email') email: string,
    @Body('codigo') codigo: string,
): Promise<{ token: string }> {
    return await this.authService.verificarCodigo(email, codigo);
}

// Restablecer contraseña usando JWT
@HttpCode(HttpStatus.OK)
@Post('restablecer-contrasena')
restablecerContrasena(
    @Body() { token, nuevaContrasena }: { token: string; nuevaContrasena: string },
) {
    return this.authService.restablecerContrasena(token, nuevaContrasena);
}

}
