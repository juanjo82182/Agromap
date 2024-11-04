import { Module } from '@nestjs/common';
import { ClimaService } from './clima.service';
import { ClimaController } from './clima.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGeocodingModule } from 'src/google-geocoding/google-geocoding.module';

@Module({
  imports: [GoogleGeocodingModule ],
  controllers: [ClimaController],
  providers: [ClimaService, PrismaService],
})
export class ClimaModule {}
