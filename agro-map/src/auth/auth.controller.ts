import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserDTO{
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
  direccion: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() user: UserDTO){
    return this.authService.logIn(user.email,user.contrasena);
  }

  @Get('users')
  getUsers(){
    return this.authService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() user: UserDTO){
    return this.authService.signUp(user.nombre,user.email,user.contrasena,user.telefono,user.direccion);
  }
}
