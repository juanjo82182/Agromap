import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { GoogleGeocodingModule } from 'src/google-geocoding/google-geocoding.module';
import { ClimaRecomendacionesModule } from '../clima-recomendaciones/clima-recomendaciones.module';
import { WeatherModule } from 'src/weather/weather.module';
import { IaModule } from 'src/ia/ia.module';
import { MailModule } from 'src/mail/mail.module'; 

@Module({
  imports: [PrismaModule,
      JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    GoogleGeocodingModule,
    ClimaRecomendacionesModule,
    WeatherModule,
    IaModule,
    MailModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
