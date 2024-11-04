import { Module } from '@nestjs/common';
import { GoogleGeocodingService } from './google-geocoding.service';
import { GoogleGeocodingController } from './google-geocoding.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GoogleGeocodingController],
  providers: [GoogleGeocodingService],
  exports: [GoogleGeocodingService],
})
export class GoogleGeocodingModule {}
