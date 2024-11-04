import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

     // Objeto para almacenar códigos de restablecimiento asociados a emails
    private codigosRestablecimiento: Record<string, string> = {};

    // Enviar email con código de restablecimiento
    async enviarEmailRestablecimiento(email: string) {
        const codigo = this.generarCodigoRestablecimiento();
        this.codigosRestablecimiento[email] = codigo; // Almacena el código asociado al email

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Restablecimiento de Contraseña',
            text: `Tu código para restablecer la contraseña es: ${codigo}`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Generar un código de 5 dígitos
    generarCodigoRestablecimiento(): string {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Verificar el código asociado a un email
    verificarCodigo(email: string, codigo: string): boolean {
        return this.codigosRestablecimiento[email] === codigo;
    }

    // Obtener email por código
    obtenerEmailPorCodigo(codigo: string): string | null {
        const email = Object.keys(this.codigosRestablecimiento).find(
            (email) => this.codigosRestablecimiento[email] === codigo
        );
        return email || null;
    }

    // Resetear el código de un usuario después de la verificación o al terminar el proceso
    resetearCodigo(email: string) {
        delete this.codigosRestablecimiento[email];
    }

    async sendSupportEmail(data: { nombre: string; telefono: string; email: string; mensaje: string }) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, 
          subject: 'Solicitud de Soporte',
          text: `Nombre: ${data.nombre}\nTeléfono: ${data.telefono}\nCorreo: ${data.email}\nMensaje: ${data.mensaje}`,
        };
        await this.transporter.sendMail(mailOptions);
      }
}
