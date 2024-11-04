import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Controller('soporte')
export class SoporteController {
    constructor(private mailService: MailService) {}

    @Post('email')
    async sendSupportEmail(@Body() data: { nombre: string; telefono: string; email: string; mensaje: string }) {
      const { nombre, telefono, email, mensaje } = data;
      await this.mailService.sendSupportEmail({ nombre, telefono, email, mensaje });
      return { message: 'Email de soporte enviado exitosamente.' };
    }
}
