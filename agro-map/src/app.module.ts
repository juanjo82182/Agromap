import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OpenCageModule } from './open-cage/open-cage.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [AuthModule, OpenCageModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
