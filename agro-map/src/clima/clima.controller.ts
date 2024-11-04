import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ClimaService } from './clima.service';

@Controller('clima')
export class ClimaController {
    constructor(private readonly climaService: ClimaService) {}

    @UseGuards(AuthGuard)
    @Get('ultimo')
    async getLastClima(@Query('usuarioId') usuarioId: string) {
        const id = Number(usuarioId);
        return this.climaService.getLastClimaRecordByUserId(id);
    }
}