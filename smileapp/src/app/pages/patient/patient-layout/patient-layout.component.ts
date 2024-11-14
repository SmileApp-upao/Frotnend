import { Component, inject } from '@angular/core';
import {RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../core/services/user/patient/patient.service';
@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.scss'
})
export class PatientLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private patientService = inject(PatientService);
  private snackbar = inject(MatSnackBar);
  hasEmergencyInfo:boolean = false;
  hasClinicalHistoric:boolean=false;
  isAuthenticated: boolean = false;

  ngOnInit(): void {
    console.log(this.hasEmergencyInfo,this.hasClinicalHistoric)

    this.consultarEstadoDatos();

  // Suscribirse a los eventos del servicio para refrescar datos automáticamente
  this.patientService.emergencyInfoUpdated$.subscribe(() => {
    this.consultarEstadoDatos();
  });
  this.patientService.clinicalHistoryUpdated$.subscribe(() => {
    this.consultarEstadoDatos();
  });
  }
  consultarEstadoDatos() {
    this.patientService.getEmercenCyInfo().subscribe({
      next: () => {
        this.hasEmergencyInfo = true;
        console.log("Información de emergencia encontrada");
      },
      error: () => {
        this.hasEmergencyInfo = false;
      }
    });
  
    this.patientService.getHistoryClinical().subscribe({
      next: () => {
        this.hasClinicalHistoric = true;
        console.log("Historia clínica encontrada");
      },
      error: () => {
        this.hasClinicalHistoric = false;
      }
    });
  }
  
  isActive(route: string): boolean {
    
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
  ErrorDatosIncompletos()
  {
    if(this.hasEmergencyInfo==false)
    {
      this.showSnackBar("Error debes completar tu informacion de emergencia");

    }
    if(this.hasClinicalHistoric==false)
      {
        this.showSnackBar("Error debes completar tu informacion clinica");
  
      }
  }
  logout():void{
    this.authService.logout();
    this.isAuthenticated=false;
    this.router.navigate(['/auth/login']);
  }
  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
}
