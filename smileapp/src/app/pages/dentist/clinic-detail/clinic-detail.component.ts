import { Component, inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { profileResponse } from '../../../shared/models/user/user-profile-model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinic-detail.component.html',
  styleUrl: './clinic-detail.component.scss'
})
export class ClinicDetailComponent {

  profileResponse!: profileResponse;
  clinic!: ClinicaResponse;
  imagePreview: SafeUrl | null = null;

  private clinicService = inject(ClinicService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.dataClinic();
  }
  dataClinic(){
    const authData = this.authService.getUser();
    const userId = authData?.id;
    if (userId) {
      this.authService.getProfile(userId).subscribe({
        next: (profileResponse) => {
          this.profileResponse = profileResponse;
          console.log('idDentista:', profileResponse.idDentista);
          this.clinicService.getClinicByDentisId(this.profileResponse.idDentista).subscribe({
            next: (clinic) => {
              this.clinic = clinic;
              this.loadImage(clinic.image);
            },
            error: (error) => {
              console.error('Error al obtener la clinica:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      })
   }
  }

  translateDay(day: string): string {
    const translations: { [key: string]: string } = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return translations[day] || day;
  }

  loadImage(filename: string): void {
    this.clinicService.viewPhoto(filename).subscribe({
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

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }


  editClinic(){
    this.router.navigate(['/dentist/clinicDetail/update']);
  }
}

