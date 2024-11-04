import { Component } from '@angular/core';
import { inject, Injectable } from "@angular/core";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../shared/data/storage.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {

  private _storage = inject(StorageService);

  isDropdownOpen = false;  
 

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

 
  signOut() {
    this._storage.remove('session'); 
  }
  
}
