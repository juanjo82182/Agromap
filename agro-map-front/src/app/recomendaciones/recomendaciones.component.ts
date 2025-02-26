import { Component } from '@angular/core';
import { inject, Injectable } from "@angular/core";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../shared/data/storage.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecomendacionesService } from './data/recomendaciones.service';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.scss'
})
export default class RecomendacionesComponent {

  private _storage = inject(StorageService);
  private _recomendacionesService = inject(RecomendacionesService);
  private map: google.maps.Map | undefined;

  isDropdownOpen = false; 
  climaActual: any;
  recomendacion: string = '';
  direccion: string = ''; 
  ciudad: string = ''; 
  codigoPostal: string = '';
  latitude: number= 0 ;
  longitude: number= 0 ;
 
  ngOnInit(): void {
    this.loadClimaRecomendaciones();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

 
  signOut() {
    this._storage.remove('session'); 
  }

  loadClimaRecomendaciones() {
    this._recomendacionesService.getClimaRecomendaciones().subscribe(
      (data) => {
        if (!data) {
          console.error('Datos de clima no encontrados:', data);
          return;
        }

        this.climaActual = data;
        this.recomendacion = data.recomendacion;
        this.direccion = data.usuarios.direccion;
        this.ciudad = data.usuarios.ciudad;
        this.codigoPostal = data.usuarios.codigo_postal;
        this.latitude = data.latitud;
        this.longitude = data.longitud;

        // Inicializar el mapa con un pequeño retraso para asegurar que todos los elementos se carguen
        setTimeout(() => {
          this.initializeMap(this.latitude, this.longitude, this.direccion, this.ciudad, this.codigoPostal);
        }, 100); // 100 ms de retraso, ajusta según sea necesario
      },
      (error) => {
        console.error('Error al obtener el clima y recomendaciones:', error);
      }
    );
  }

  initializeMap(latitud: number, longitud: number, direccion: string, ciudad: string, codigoPostal: string) {
    const loader = new Loader({
      apiKey: 'Tu api key',
      version: 'weekly',
    });
    
    loader.load().then(() => {
      const mapOptions = {
        center: { lat: latitud, lng: longitud },
        zoom: 13,
      };
      const mapElement = document.getElementById('map') as HTMLElement;
      this.map = new google.maps.Map(mapElement, mapOptions);
      
       // Agregar los parámetros de componentes para mejorar la precisión en la búsqueda de dirección
       const geocoder = new google.maps.Geocoder();
       const fullAddress = `${direccion}, ${ciudad}, ${codigoPostal}, Colombia`;
       const request = {
         address: fullAddress,
         componentRestrictions: {
           country: 'CO',
           locality: ciudad,
           postalCode: codigoPostal,
         },
       };
 
       geocoder.geocode(request, (results, status) => {
         if (status === 'OK' && results && results[0]) {
           const location = results[0].geometry.location;
           this.map?.setCenter(location);
 
           const marker = new google.maps.Marker({
             position: location,
             map: this.map,
             title: `Clima en ${ciudad}, ${direccion}, ${codigoPostal}: ${this.recomendacion}`,
           });
 
           const infoWindow = new google.maps.InfoWindow({
             content: `<p>Clima en ${ciudad}, ${direccion}, ${codigoPostal}: ${this.recomendacion}</p>`,
           });
 
           marker.addListener('click', () => {
             infoWindow.open(this.map, marker);
           });
         } else {
           console.error('Geocode fue no exitoso debido a: ' + status);
         }
       });
     });
   }

}
