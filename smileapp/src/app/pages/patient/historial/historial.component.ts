import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitasResponse } from '../../../shared/models/cita/citas.response.model';
import { CitaService } from '../../../core/services/cita/cita.service';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent {

  miscitas:CitasResponse[]=[];
  filtercitas: CitasResponse[] = [];
  searchQuery: string = '';

  private citaService= inject(CitaService);
  private router = inject(Router)

  ngOnInit(): void {
  
    this.citaService.myCitas().subscribe({
      next:(cita) => {
        this.miscitas = cita;
        this.filtercitas=cita;
        console.log(this.miscitas);
      },
      error:(error) => console.log('No tienes Citas',error)
    });;

  }
  onSearch(): void {
    const query = this.searchQuery; 
    if (!this.searchQuery) {
      this.filtercitas = this.miscitas;
    } else {
      this.filtercitas = this.miscitas.filter(cita => cita.date === query);
    }
  }
  clearFilter(): void {
    this.searchQuery = '';
    this.filtercitas = [...this.miscitas];
  }
  filterToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.filtercitas = this.miscitas.filter(cita => cita.date === today);
  }

  filterTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    this.filtercitas = this.miscitas.filter(cita => cita.date === tomorrowStr);
  }

  filterThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay())));

    this.filtercitas = this.miscitas.filter(cita => {
      const citaDate = new Date(cita.date);
      return citaDate >= startOfWeek && citaDate <= endOfWeek;
    });
  }

  filterNextWeek(): void {
    const today = new Date();
    const startOfNextWeek = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    this.filtercitas = this.miscitas.filter(cita => {
      const citaDate = new Date(cita.date);
      return citaDate >= startOfNextWeek && citaDate <= endOfNextWeek;
    });
  }
}