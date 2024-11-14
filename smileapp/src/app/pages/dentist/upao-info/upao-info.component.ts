import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upao-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upao-info.component.html',
  styleUrl: './upao-info.component.scss'
})
export class UpaoInfoComponent {
  clinic: any = {};
  daysOfWeek = [
    { value: 'MONDAY', label: 'Lunes' },
    { value: 'TUESDAY', label: 'Martes' },
    { value: 'WEDNESDAY', label: 'Miércoles' },
    { value: 'THURSDAY', label: 'Jueves' },
    { value: 'FRIDAY', label: 'Viernes' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];
  isStudent: boolean = false;

  constructor(
    private clinicService: ClinicService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(profile => {
      this.isStudent = profile.condition === 'Estudiante';
      if (this.isStudent) {
        this.loadClinicData(1);
      }
    });
  }

  loadClinicData(clinicId: number): void {
    this.clinicService.getClinicById(clinicId).subscribe(
      data => {
        this.clinic = data;
      },
      error => {
        console.error('Error al cargar los datos de la clínica:', error);
      }
    );
  }

  getFormattedTime(time: string): string {
    return time ? time.slice(0, 5) : 'No disponible';
  }

  getTranslatedDays(): string[] {
    if (!this.clinic.openDays) return [];

    return this.clinic.openDays.map((day: string) => {
      const translatedDay = this.daysOfWeek.find(d => d.value === day);
      return translatedDay ? translatedDay.label : day;
    });
  }
}
