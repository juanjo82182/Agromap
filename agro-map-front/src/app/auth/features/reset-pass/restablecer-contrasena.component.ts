import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data/auth.service';

interface FormEmail {
  email: FormControl<string>;
}

interface FormCodigo {
  codigo: FormControl<string>; 
}

interface FormNuevaContrasena {
  nuevaContrasena: FormControl<string>;
}

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './restablecer-contrasena.component.html',
   styleUrl: './restablecer-contrasena.component.scss'
})
export default class RestablecerContrasenaComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private _router = inject(Router);

  pasoActual: number = 1; // 1: Email, 2: Código, 3: Nueva Contraseña
  jwtToken: string | null = null;

  formEmail: FormGroup<FormEmail> = this.fb.group<FormEmail>({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  formCodigo: FormGroup<FormCodigo> = this.fb.group<FormCodigo>({
    codigo: this.fb.nonNullable.control('', [Validators.required]), // Cambiado a código
  });

  formNuevaContrasena: FormGroup<FormNuevaContrasena> = this.fb.group<FormNuevaContrasena>({
    nuevaContrasena: this.fb.nonNullable.control('', [Validators.required]),
  });

   // Paso 1: Enviar código de restablecimiento
   enviarCodigoRestablecimiento() {
    if (this.formEmail.invalid) return;
    const { email } = this.formEmail.getRawValue();

    this.authService.enviarCodigoRestablecimiento(email).subscribe({
      next: () => {
        alert('Código de restablecimiento enviado a tu email.');
        this.pasoActual = 2;
      },
      error: () => alert('No se pudo enviar el código de restablecimiento.'),
    });
  }

  // Paso 2: Verificar código
  verificarCodigo() {
    if (this.formCodigo.invalid) return;
    const { codigo } = this.formCodigo.getRawValue();
    const { email } = this.formEmail.getRawValue();

    // Llama al servicio para verificar el código y obtener el token JWT
    this.authService.verificarCodigo(email, codigo).subscribe({
      next: (response) => {
        this.jwtToken = response.token; // Guarda el JWT para el siguiente paso
        this.pasoActual = 3; // Avanza al paso 3 si el código es correcto
      },
      error: () => {
        alert('Error al verificar el código.');
      }
    });
  }

  // Paso 3: Restablecer la contraseña
  restablecerContrasena() {
    if (this.formNuevaContrasena.invalid || !this.jwtToken) return;
    const { nuevaContrasena } = this.formNuevaContrasena.getRawValue();

    this.authService.restablecerContrasena(this.jwtToken, nuevaContrasena).subscribe({
      next: () => {
        alert('Contraseña restablecida con éxito.');
        this._router.navigateByUrl('/log-in');
      },
      error: () => alert('No se pudo restablecer la contraseña.'),
    });
  }
  
}