import { Controller, Get, Query } from '@nestjs/common';
import { OpenCageService } from './open-cage.service';

@Controller('geocode')
export class OpenCageController {
  constructor(private readonly openCageService: OpenCageService) {}

  @Get('address')
  geocode(@Query('address') address: string, @Query('city') city?: string) {
    return this.openCageService.geocodeAddress(address, city);
  }
}
