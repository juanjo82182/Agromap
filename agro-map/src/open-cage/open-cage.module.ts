import { Module } from '@nestjs/common';
import { OpenCageService } from './open-cage.service';
import { OpenCageController } from './open-cage.controller';
import { HttpModule } from '@nestjs/axios'; 

@Module({
  imports: [HttpModule],
  controllers: [OpenCageController],
  providers: [OpenCageService],
})
export class OpenCageModule {}
