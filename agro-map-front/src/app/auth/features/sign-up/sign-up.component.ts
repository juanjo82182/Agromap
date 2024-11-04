import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data/auth.service';
import { CommonModule } from '@angular/common';

interface LoginForm{
  nombre: FormControl<string>;
  email: FormControl<string>;
  contrasena: FormControl<string>;
  telefono: FormControl<string>;
  direccion: FormControl<string>;
  ciudad: FormControl<string>;
  codigo_postal: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export default class SignUpComponent {

  private _authService = inject(AuthService);

  private _router = inject(Router);

   form: FormGroup<LoginForm>;

  constructor(private _formBuilder: FormBuilder){
      this.form = this._formBuilder.group<LoginForm>({
      nombre: this._formBuilder.nonNullable.control('', Validators.required),
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      contrasena: this._formBuilder.nonNullable.control('', Validators.required),
      telefono: this._formBuilder.nonNullable.control(''),
      direccion: this._formBuilder.nonNullable.control('', Validators.required),
      ciudad: this._formBuilder.nonNullable.control('', Validators.required),
      codigo_postal: this._formBuilder.nonNullable.control(''),
    });
  }

  submit(){
    if(this.form.invalid) return; 

    const {nombre, email, contrasena, telefono, direccion,ciudad,codigo_postal} = this.form.getRawValue();

    this._authService.signUp(nombre,email,contrasena,telefono,direccion,ciudad,codigo_postal).subscribe({
      next: (response) => {
        this._router.navigateByUrl('/log-in');
      },
      error: (error) => console.log(error),
    });
  }
}
