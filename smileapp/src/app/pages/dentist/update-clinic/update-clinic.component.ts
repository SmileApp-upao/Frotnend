import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { profileResponse } from '../../../shared/models/user/user-profile-model';

@Component({
  selector: 'app-update-clinic',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-clinic.component.html',
  styleUrl: './update-clinic.component.scss'
})
export class UpdateClinicComponent implements OnInit {

  clinicForm: FormGroup;
  profileResponse!: profileResponse;
  imagePreview: SafeUrl | null = null;
  idClinic!: number;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clinicService = inject(ClinicService);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.clinicForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telf: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      desc: ['', [Validators.required]],
      openHour: ['', [Validators.required]],
      closeHour: ['', [Validators.required]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadClinicProfile();
  }

  loadClinicProfile(): void {
    const authData = this.authService.getUser();
    const userId = authData?.id;
    if (userId) {
      this.authService.getProfile(userId).subscribe({
        next: (profileResponse) => {
          this.profileResponse = profileResponse;
          this.clinicService.getClinicByDentisId(this.profileResponse.idDentista).subscribe({
            next: (clinic) => {
              this.idClinic = clinic.id;
              this.loadClinicImage(clinic.image);
              this.clinicForm.patchValue(clinic);
            },
            error: (error) => {
              console.error('Error al obtener la clinica:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      });
    }
  }


  loadClinicImage(filename: string): void {
    this.clinicService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error) => {
        console.error('Error al cargar la imagen de la clínica', error);
        this.showSnackBar('Error al cargar la imagen de la clínica');
      }
    });
  }

  onSubmit(): void {
    if(this.clinicForm.valid) {
      const updatedClinic = {...this.clinicForm.value};
      const image = this.clinicForm.get('image')?.value;

      this.clinicService.updateClinic(updatedClinic).subscribe({
        next: () => {
          console.log('Datos de la clínica actualizados correctamente');
          this.showSnackBar('Datos actualizados correctamente');
          this.router.navigate(['/dentist/clinicDetail']);
        },
        error: (error) => {
          console.error('Error al actualizar los datos de la clínica', error);
          this.showSnackBar('Error al actualizar los datos de la clínica');
        }
      });
      this.clinicService.updatePhoto(this.idClinic, image).subscribe({
        next: () => {
          console.log('Imagen de la clínica actualizada correctamente');
          this.showSnackBar('Imagen actualizada correctamente');
          this.router.navigate(['/dentist/clinicDetail']);
        },
        error: (error) => {
          console.error('Error al actualizar la imagen de la clínica', error);
          this.showSnackBar('Error al actualizar la imagen de la clínica');
        }
      })
    } else { 
      this.showSnackBar('Por favor, complete todos los campos requeridos');
    }
  }

  private showSnackBar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        this.clinicForm.patchValue({
          image: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  gotoBack(){
    this.router.navigate(['/dentist/clinicDetail']);
  }
}