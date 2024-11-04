import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data/auth.service';
import { CommonModule } from '@angular/common';


interface LoginForm{
  email: FormControl<string>;
  contrasena: FormControl<string>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export default class LogInComponent {
  
  private _authService = inject(AuthService);

  private _router = inject(Router);

   form: FormGroup<LoginForm>;

  constructor(private _formBuilder: FormBuilder){
      this.form = this._formBuilder.group<LoginForm>({
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      contrasena: this._formBuilder.nonNullable.control('', Validators.required),
    });
  }

  submit(){
    if(this.form.invalid) return; 
    const {email, contrasena} = this.form.getRawValue();
    this._authService.logIn(email,contrasena).subscribe({
      next: (response) => {
        this._router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.form.reset();
        alert('Usuario o contraseña incorrecta');
      },
    });
  }
}
