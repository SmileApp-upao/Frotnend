import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-List-of-Dentist',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './List-of-Dentist.component.html',
  styleUrl: './List-of-Dentist.component.scss'
})
export class ListofdentistComponent {
  clinicId: string = "";
  clinica!: ClinicaResponse;
  dentistas:DentistResponse[]=[];
  filterDentist: DentistResponse[] = [];
  cycles: number[] = [5, 6, 7, 8, 9, 10]; 

  searchQuery: string = '';

  private clinicService= inject(ClinicService);
  private router = inject(Router)

  ngOnInit(): void {
    this.clinicId = localStorage.getItem('selectedClinicId') || "";
    this.clinicService.getClinicById(+this.clinicId).subscribe({
      next:(clinic) => {
        this.clinica = clinic;
        this.dentistas=clinic.dentists
        this.filterDentist=clinic.dentists
        console.log(this.clinica);
        console.log(this.dentistas);
      },
      error:(error) => console.log('Error al cargar la clinica',error)
    });;

  }

  onSearch(): void {
    const query = Number(this.searchQuery); 
    if (!this.searchQuery) {
      this.filterDentist = this.dentistas;
    } else {
      this.filterDentist = this.dentistas.filter(dentist => dentist.cicle === query);
    }
  }
  clearFilter(): void {
    this.searchQuery = '';
    this.filterDentist = [...this.dentistas]; // Restablecemos la lista completa
  }
  DentistDetails(dentistId: number): void {
    localStorage.setItem('selectedDentistId', dentistId.toString());
    console.log("id seleccionado: " , dentistId)
    this.router.navigate(['patient/cita/dentistas/dentista'])
  }
}
