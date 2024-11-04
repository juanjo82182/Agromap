import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { spawn } from 'child_process';

@Injectable()
export class IaService {
    async ejecutarModelo(datos: { temperatura: number, humedad: number, viento: number, presion: number, precipitacion: number }): Promise<any> {
        const pythonScriptPath = join(__dirname, '..', 'python_scripts', 'modelo_ia.py');
        
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(datos)]);

            let result = '';

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                reject(`Error al ejecutar el script de IA: ${data.toString()}`);
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(JSON.parse(result));
                } else {
                    reject(`El proceso Python finalizó con el código: ${code}`);
                }
            });
        });
    }
}