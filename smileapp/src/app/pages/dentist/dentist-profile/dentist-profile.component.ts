import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthResponse } from '../../../shared/models/auth/auth-response-model';
import { profileResponse } from '../../../shared/models/user/user-profile-model';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  profileResponse!:profileResponse;
  imagePreview: SafeUrl | null = null;

  private clinicService= inject(ClinicService);
  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar);


  clinica!: ClinicaResponse;

  private router = inject(Router);

  constructor(private dentistService: DentistService,
    private authService: AuthService) { }

  ngOnInit(): void {
    
    const userData = this.authService.getUser();
    if (userData && userData.id) {

      this.loadDentistProfile(userData.id);

    } else {
      console.error('No se pudo obtener el ID del usuario autenticado');
    }
  }

  private loadDentistProfile(id: number) {
    
    this.authService.getProfile(id).subscribe({
      next: (profile: profileResponse) => { 
        if (profile.gender?.toLowerCase() === 'm' || profile.gender?.toLowerCase() === 'male') {
          profile.gender = 'Masculino';
        } else if (profile.gender?.toLowerCase() === 'f' || profile.gender?.toLowerCase() === 'female') {
          profile.gender = 'Femenino';
        }
        this.profileResponse = profile;
        console.log("Perfil",profile);
        if (profile.image != null) {
          this.loadUserImage(profile.image);
        }
        this.clinicService.getClinicByDentisId( this.profileResponse.idDentista).subscribe({
          next: (clinic) => {
            this.clinica = clinic;
            console.log(clinic);
          },
          error: (error) => console.log('Error al cargar la clinica', error)
        });
      },
      error: (error: any) => {
        console.error('Error fetching dentist profile', error);
      }
    });
    
  }

  loadUserImage(filename: string): void {
    this.dentistService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('Image URL:', this.imagePreview);
      },
      error: (error) => {
        console.error('Error al cargar la imagen del usuario', error);
        this.showSnackBar('Error al cargar la imagen del usuario');
      }
    });
  }

  navigateUpdateProfile(){
    console.log('Condition: ', this.profileResponse.condition);
    if(this.profileResponse.condition === 'Estudiante'){
      this.router.navigate(['/dentist/profile/estudiante/update']);
    }else{
      this.router.navigate(['/dentist/profile/profesional/update']);
    }
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
}