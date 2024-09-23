import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('log-in')
  logIn(){
    return 'log-in';
  }

  @Get('sign-up')
  signUp(){
    return 'sign-up';
  }
}
