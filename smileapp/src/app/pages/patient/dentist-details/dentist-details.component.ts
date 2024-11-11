import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
@Component({
  selector: 'app-dentist-details',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dentist-details.component.html',
  styleUrl: './dentist-details.component.scss'
})
export class DentistDetailsComponent {
  clinicId: string = "";
  clinica!: ClinicaResponse;
  dentista!:DentistResponse;
  dentistId: number | null = null; 
  hover: boolean = false;
  private clinicService= inject(ClinicService);
  private dentistService= inject(DentistService);
  private router = inject(Router);
  ngOnInit(): void 
  { console.log(localStorage.getItem('selectedDentistId'))
    if(localStorage.getItem('selectedDentistId')!=null)
    {

      this.dentistId= parseInt(localStorage.getItem('selectedDentistId') || '', 10);
      this.clinicId = localStorage.getItem('selectedClinicId') || "";
      this.clinicService.getClinicById(+this.clinicId).subscribe({
        next: (clinic) => {
          this.clinica = clinic;
          console.log(clinic);
        },
        error: (error) => console.log('Error al cargar la clinica', error)
      });
      this.fetchDentistDetails(this.dentistId);

    }
    else{
      this.clinicId = localStorage.getItem('selectedClinicId') || "";
    this.clinicService.getClinicById(+this.clinicId).subscribe({
      next: (clinic) => {
        this.clinica = clinic;
        console.log(clinic);
        if (this.clinica.dentists && this.clinica.dentists.length > 0) {
          this.dentistId = this.clinica.dentists[0].userId;
          this.fetchDentistDetails(this.dentistId);
        }
      },
      error: (error) => console.log('Error al cargar la clinica', error)
    });
    }
    localStorage.removeItem('selectedDentistId');
  }
  
  fetchDentistDetails(dentistId: number): void {
    this.dentistService.getUserbyID(dentistId).subscribe({
      next: (dentist) => {
        this.dentista = dentist;
        console.log(dentist);
      },
      error: (error) => console.log('Error al cargar el dentista', error)
    });
  }

  Volver():void
  {
    if(+this.clinicId===1)
      {
        this.router.navigate(['patient/cita/dentistas']);
      }
    else
    {
      this.router.navigate(['patient/cita']);
    }
  }

  }
 
