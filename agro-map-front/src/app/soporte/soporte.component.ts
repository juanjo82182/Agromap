import { Component } from '@angular/core';
import { inject, Injectable } from "@angular/core";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../shared/data/storage.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SoporteService } from './data/soporte.service';

interface SupportForm {
  nombre: FormControl<string>;
  telefono: FormControl<string>;
  email: FormControl<string>;
  mensaje: FormControl<string>;
}


@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.scss'
})
export default class SoporteComponent {

  private _storage = inject(StorageService);
  private supportService = inject(SoporteService);
  isDropdownOpen = false;  
  form: FormGroup<SupportForm>;

  constructor(private _formBuilder: FormBuilder) {
    // Inicializa el formulario con validadores
    this.form = this._formBuilder.group<SupportForm>({
      nombre: this._formBuilder.nonNullable.control('', Validators.required),
      telefono: this._formBuilder.nonNullable.control('', Validators.required),
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      mensaje: this._formBuilder.nonNullable.control('', Validators.required),
    });
  }
 

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

 
  signOut() {
    this._storage.remove('session'); 
  }

  enviarFormulario() {
    if (this.form.invalid) return;

    const formData = this.form.getRawValue();
    this.supportService.sendSupportEmail(formData).subscribe({
    next: () => {
      alert('Tu solicitud de soporte ha sido enviada.');
      this.form.reset(); 
    },
    error: () => alert('No se pudo enviar el formulario de soporte.'),
  });
  }

}
