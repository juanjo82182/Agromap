import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {

    constructor(private readonly iaService: IaService) {}

    @Post('predecir')
    async predecir(@Body() datos: { temperatura: number, humedad: number, viento: number, presion: number, precipitacion: number }) {
        return await this.iaService.ejecutarModelo(datos);
    }
}