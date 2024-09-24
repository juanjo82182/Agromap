import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get('log-in')
  logIn(){
    return 'log-in';
  }

  @Get('users')
  getUsers(){
    return this.authService.getUsers();
  }

  @Post('sign-up')
  signUp(@Body() user: UserDTO){
    return this.authService.signUp(user.nombre,user.email,user.contrasena,user.telefono,user.direccion);
  }
}
