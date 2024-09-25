import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface LoginForm{
  nombre: FormControl<string>;
  email: FormControl<string>;
  contrasena: FormControl<string>;
  telefono: FormControl<string>;
  direccion: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export default class SignUpComponent {
  
  form: FormGroup<LoginForm>;
  
  constructor(private _formBuilder: FormBuilder){
      this.form = this._formBuilder.group<LoginForm>({
      nombre: this._formBuilder.nonNullable.control('', Validators.required),
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      contrasena: this._formBuilder.nonNullable.control('', Validators.required),
      telefono: this._formBuilder.nonNullable.control(''),
      direccion: this._formBuilder.nonNullable.control('', Validators.required),
    });
  }

  submit(){
    console.log(this.form.value);
  }
}
