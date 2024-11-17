import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup,FormArray ,FormsModule,ReactiveFormsModule, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-update-dentist-prof',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-dentist-prof.component.html',
  styleUrl: './update-dentist-prof.component.scss'
})
export class UpdateDentistProfComponent {

  updateDentistForm: FormGroup;
  imagePreview: SafeUrl | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dentistService = inject(DentistService);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.updateDentistForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      image: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      studyCenter: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const authData = this.authService.getUser();
    const userId = authData?.id;
    if(userId) {
      console.log('Cargando datos del usuario...', userId);
      this.dentistService.getProfesionalProfile(userId).subscribe({
          next: (dentistProfile) => {
            console.log('Datos del usuario cargados correctamente:', dentistProfile);
            this.updateDentistForm.patchValue(dentistProfile);
            console.log('Cargando imagen del usuario...', dentistProfile.image);
            if (dentistProfile.image != null) {
              this.loadUserImage(dentistProfile.image);
            }
          },
          error: (error) => {
            console.error('Error al cargar el usuario', error);
            this.showSnackBar('Error al cargar el usuario');
          }
        });
    }

  }

  loadUserImage(filename: string): void {
    this.dentistService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error) => {
        console.error('Error al cargar la imagen del usuario', error);
        this.showSnackBar('Error al cargar la imagen del usuario');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        this.updateDentistForm.patchValue({
          image: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {

    if(this.updateDentistForm.valid) {
      const updatedDentist = {...this.updateDentistForm.value};
      const authData = this.authService.getUser();
      const userId = authData?.id;
      const image = this.updateDentistForm.get('image')?.value;

      if(userId) {
        console.log('Actualizando datos del usuario...', userId);
        this.dentistService.updateProfesionalDentist(userId, updatedDentist).subscribe({
            next: () => {
              console.log('Datos del usuario actualizados correctamente');
              this.showSnackBar('Datos actualizados correctamente');
              this.router.navigate(['/dentist/profile']);
            },
            error: (error) => {
              console.error('Error al actualizar los datos del usuario', error);
            let errorMessage = 'Error al actualizar los datos del usuario';
            if (error.error && typeof error.error === 'object') {
              // Si el error es un objeto, intentamos extraer el mensaje
              if (error.error.message) {
                errorMessage = error.error.message;
              } else if (error.error.error) {
                errorMessage = error.error.error;
              }
            } else if (typeof error.error === 'string') {
              // Si el error es una cadena, la usamos directamente
              errorMessage = error.error;
            }
            this.showSnackBar(errorMessage);
            }
          });

        this.dentistService.updatePhoto(userId, image).subscribe({
          next: () => {
            console.log('Imagen del usuario actualizada correctamente');
            this.showSnackBar('Imagen actualizada correctamente');
            this.router.navigate(['/dentist/profile']);

          },
          error: (error) => {
            console.error('Error al actualizar la imagen del usuario', error);
            let errorMessage = 'Error al actualizar la imagen del usuario';
            if (error.error && typeof error.error === 'object') {
              if (error.error.message) {
                errorMessage = error.error.message;
              } else if (error.error.error) {
                errorMessage = error.error.error;
              }
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
            this.showSnackBar(errorMessage);
            }
        })
      }
    } else {
      this.showSnackBar('Por favor, complete todos los campos');
    }
}
  navigateBack(){
    this.router.navigate(['/dentist/profile']);
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }

}
