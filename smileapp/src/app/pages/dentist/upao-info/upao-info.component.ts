import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-upao-info',
  standalone: true,
  imports: [],
  templateUrl: './upao-info.component.html',
  styleUrl: './upao-info.component.scss'
})
export class UpaoInfoComponent {
  clinic: any = {}; 
  isStudent: boolean = false;

  constructor(
    private clinicService: ClinicService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario es un estudiante
    this.authService.getUserProfile().subscribe(profile => {
      this.isStudent = profile.condition === 'Estudiante'; // Ajusta según tu lógica de roles
      if (this.isStudent) {
        this.loadClinicData(1); // Carga la clínica con ID 1 (UPAO) para el estudiante
      }
    });
  }

  // Método para cargar la información de la clínica
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
}
