import { Controller, Get, Query } from '@nestjs/common';
import { GoogleGeocodingService } from './google-geocoding.service';

@Controller('geocode1')
export class GoogleGeocodingController {
  constructor(private readonly googleGeocodingService: GoogleGeocodingService) {}

  @Get('address')
  geocode(@Query('address') address: string, @Query('city') city?: string,@Query('postalCode') postalCode?: string) {
    return this.googleGeocodingService.geocodeAddress(address, city,postalCode);
  }
}
