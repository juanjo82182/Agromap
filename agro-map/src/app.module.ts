import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { ClimaModule } from './clima/clima.module';
import { IaModule } from './ia/ia.module';
import { PrismaModule } from './prisma/prisma.module';
import { GoogleGeocodingModule } from './google-geocoding/google-geocoding.module';
import { ClimaRecomendacionesModule } from './clima-recomendaciones/clima-recomendaciones.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { SoporteController } from './soporte/soporte.controller';


@Module({
  imports: [AuthModule, WeatherModule, ClimaModule, IaModule, GoogleGeocodingModule, ClimaRecomendacionesModule, PrismaModule, MailModule],
  controllers: [AppController, SoporteController],
  providers: [AppService, SchedulerService, MailService],
})
export class AppModule {}
