import { Component, inject } from '@angular/core';
import { PatientResponse } from '../../../models/user/patient/patient-response-model';
import { PatientService } from '../../../../core/services/user/patient/patient.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmergencyInfoResponse } from '../../../models/user/patient/emergency-response.model';
import { EmergencyInfoRequest } from '../../../models/user/patient/emercency-request.model';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  paciente!: PatientResponse;

  edad: number = 0;
  private patienService = inject(PatientService);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  emergencyInfo!: EmergencyInfoResponse;
  emergencyForm!: FormGroup;
  showOtherRelationship = false;
  existEmergencyInfo: boolean = false;

  ngOnInit(): void {

    const authData = this.authService.getUser();
    const userId = authData?.id;

    this.emergencyForm = this.fb.group({
      parent: ['', Validators.required],
      name : ['',Validators.required],
      dir: ['',Validators.required],
      phone: [
        '', 
        [
          Validators.required,
          Validators.maxLength(9),
          Validators.minLength(9),
          Validators.pattern(/^[0-9]+$/) // Solo números
        ]
      ],
      otherRelationship: [''],
    });


    if (userId) {
      this.patienService.getUserbyID(userId).subscribe({
        next: (profile) => {
          this.paciente = profile;
          this.edad = this.calculateAge(profile.birthday);
          this.showSnackBar('Perfil cargado con éxito.');
        },
        error: (error) => {
          this.showSnackBar('Error al cargar el perfil');
        },
      });
    }

    this.patienService.getEmercenCyInfo().subscribe(
      {
        next:(emercency) =>
        {
          this.emergencyInfo=emercency;
          this.existEmergencyInfo=true;
        },
        error:()=>
        {
          console.log('Error al cargar la informacion de emergencia');
        }
      }
    );
  }


  private showSnackBar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 2000,
      verticalPosition: 'top',
    });

  }

  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Verifica si aún no ha cumplido años este año
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  Editar(userId: number): void {
    this.router.navigate(['patient/actualizar']);
  }

  onRelationshipChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showOtherRelationship = selectedValue === 'Otro';

    if (this.showOtherRelationship) {
      this.emergencyForm
        .get('otherRelationship')
        ?.setValidators(Validators.required);
    } else {
      this.emergencyForm.get('otherRelationship')?.clearValidators();
      this.emergencyForm.get('otherRelationship')?.reset();
    }
    this.emergencyForm.get('otherRelationship')?.updateValueAndValidity();
  }
  onSubmit(): void {
    if (this.emergencyForm.valid) {
      console.log('Formulario válido y listo para enviar:', this.emergencyForm.value);
  
      const emergencyInfo: EmergencyInfoRequest = { ...this.emergencyForm.value };
  
      if (this.emergencyForm.value.parent === 'Otro') {
        
        emergencyInfo.parent = this.emergencyForm.value.otherRelationship;
        delete emergencyInfo.otherRelationship;
      }
  
      console.log("datos a enviar:",emergencyInfo);
  
      this.patienService.createEmergencyInfo(emergencyInfo).subscribe({
        next: () => {
          this.showSnackBar('Información de emergencia registrada exitosamente.');
          this.existEmergencyInfo=true;
          this.patienService.getEmercenCyInfo().subscribe(
            {
              next:(emercency) =>
              {
                this.emergencyInfo=emercency;
                this.existEmergencyInfo=true;
              },
              error:()=>
              {
                console.log('Error al cargar la informacion de emergencia');
              }
            }
          );
        },
        error: (error) => {
          const errorMessage = error.error['error'] || 'Ocurrió un error al registrar la información';
          console.log('Error:', errorMessage);
          this.showSnackBar(errorMessage);
        }
      });
    }
    this.router.navigate(['/patient']);
  }
}
