import { Component, viewChild } from '@angular/core';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { CommonModule } from '@angular/common';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import {GoogleMap,MapAdvancedMarker,MapInfoWindow} from '@angular/google-maps';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-cita-layout',
  standalone: true,
  imports: [CommonModule,GoogleMap,MapAdvancedMarker,MapInfoWindow,RouterLink],
  templateUrl: './cita-layout.component.html',
  styleUrl: './cita-layout.component.scss'
})
export class CitaLayoutComponent {
  clinicas: ClinicaResponse[] = [];
  private clinicService= inject(ClinicService);
  
  center: google.maps.LatLngLiteral = {lat: -8.1285703, lng: -79.0326985};

  zoom = 16;

  infoWindowRef =  viewChild.required(MapInfoWindow);

  private router = inject(Router)
  ngOnInit()
  {
    localStorage.removeItem('selectedClinicId');
    localStorage.removeItem('selectedDentistId');
    this.clinicService.getAllClinics().subscribe({
      next:(clinic) => {
        this.clinicas = clinic;
        console.log(this.clinicas);
      },
      error:(error) => console.log('Error al cargar las clinicas',error)
    });
  }
 MarkerClick(clinica : ClinicaResponse,marker:MapAdvancedMarker)
 {  

  const content = `
  <div class = "row-md-4">
  <h5 class = "fw-bold">${clinica.name}</h5>
  <p>${clinica.desc}</p>
  <p>Horario: ${clinica.openHour} - ${clinica.closeHour}</p>
  <p>Dias: ${clinica.openDays}</p>
  <button class ="btn btn-primary" id="selectClinicaButton">Seleccionar</button>
  <div>`
  this.infoWindowRef().open(marker,false,content);
  setTimeout(() => {
    const selectButton = document.getElementById('selectClinicaButton');
    if (selectButton) {
      selectButton.addEventListener('click', () => {
        localStorage.setItem('selectedClinicId', clinica.id.toString());
        if(clinica.id===1)
        {
          this.router.navigate(['patient/cita/dentistas']);
        }
        else
        {
         
          this.router.navigate(['patient/cita/dentistas/dentista']);
        }
        
      });
    }
  }, 0);
 }
 
}
