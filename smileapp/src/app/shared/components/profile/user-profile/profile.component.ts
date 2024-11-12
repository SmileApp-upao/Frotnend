import { Component, inject } from '@angular/core';
import { PatientResponse } from '../../../models/user/patient/patient-response-model';
import { PatientService } from '../../../../core/services/user/patient/patient.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  paciente!:PatientResponse;
  edad : number=0;
  private patienService = inject(PatientService)
  private authService = inject(AuthService)
  private snackbar = inject(MatSnackBar);
  ngOnInit():void
  { const authData = this.authService.getUser();
    const userId = authData?.id;
    if(userId)
    { this.patienService.getUserbyID(userId).subscribe({
      next: (profile) => {
        this.paciente = profile;
        this.edad = this.calculateAge(profile.birthday);
        this.showSnackBar('Perfil cargado con éxito.');
      },
      error: (error) => {
        this.showSnackBar('Error al cargar el perfil');
      }
    });

    }
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Verifica si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  }

