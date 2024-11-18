import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { profileResponse } from '../../../shared/models/user/user-profile-model';
declare const google: any;
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
  originalImage: string | null = null;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clinicService = inject(ClinicService);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);
  imageFile: File | null = null;
  latitude: number = 0;
  longitude: number = 0;
  map: any;
  marker: any;

  daysOfWeek = [
    { value: 'MONDAY', label: 'Lunes' },
    { value: 'TUESDAY', label: 'Martes' },
    { value: 'WEDNESDAY', label: 'Miércoles' },
    { value: 'THURSDAY', label: 'Jueves' },
    { value: 'FRIDAY', label: 'Viernes' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];

  constructor() {
    this.clinicForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telf: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      desc: ['', [Validators.required]],
      openHour: ['', [Validators.required]],
      closeHour: ['', [Validators.required]],
      openDays: this.fb.array(
        this.daysOfWeek.map(() => this.fb.control(false)) , 
        [this.atLeastOneCheckboxChecked()]
      ),
      latitude: ['', [
        Validators.pattern(/^[-+]?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/), // Latitud: -90 a 90
        Validators.required
      ]],
      longitude: ['', [
        Validators.pattern(/^[-+]?([1]?[0-7]?[0-9](\.[0-9]+)?|180(\.0+)?)$/), // Longitud: -180 a 180
        Validators.required
      ]],
    });
  }

  ngOnInit(): void {
    this.initializeMap();
    this.loadClinicProfile();
  }
  initializeMap() {
    const defaultLocation = { lat: -8.129924, lng: -79.032172 }; // Ubicación inicial (ej. Lima, Perú)
    this.map = new google.maps.Map(document.getElementById('map')!, {
      center: defaultLocation,
      zoom: 18
    });

    // Añadir marcador de ubicación inicial
    this.marker = new google.maps.Marker({
      position: defaultLocation,
      map: this.map,
      draggable: true
    });

    // Actualizar coordenadas cuando se mueve el marcador
    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      this.latitude = position.lat();
      this.longitude = position.lng();
      this.clinicForm.get('latitude')?.setValue(this.latitude);
      this.clinicForm.get('longitude')?.setValue(this.longitude);
    });

    // Actualizar coordenadas al hacer clic en el mapa
    this.map.addListener('click', (event: any) => {
      this.marker.setPosition(event.latLng);
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
    });
  }
  // Método para enviar el formulario con la imagen
  onImageSubmit(): void {
    if (this.imageFile) {
      this.clinicService.updatePhoto(this.idClinic, this.imageFile).subscribe({
        next: () => {
          console.log('Imagen de la clínica actualizada correctamente');
          this.showSnackBar('Imagen actualizada correctamente');
          this.router.navigate(["dentist/clinicDetail"]);
        },
        error: (error) => {
          // Extraer el mensaje de error del backend
          const errorMessage = error?.error?.error;
          console.error('Error al actualizar la imagen de la clínica:', errorMessage);
          this.showSnackBar(errorMessage); // true indica que es un error
        }
      });
    } else {
      this.showSnackBar('Por favor, seleccione una imagen antes de guardar');
    }
  }
  atLeastOneCheckboxChecked(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const hasAtLeastOneChecked = formArray.controls.some(ctrl => ctrl.value === true);
  
      return hasAtLeastOneChecked ? null : { required: true };
    };
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
  
              // Guardar la imagen original
              this.originalImage = clinic.image;
  
              // Cargar la imagen para mostrarla
              this.loadClinicImage(clinic.image);
  
              // Cargar los datos de la clínica en el formulario
              this.clinicForm.patchValue(clinic);
            },
            error: (error) => {
              console.error('Error al obtener la clínica:', error);
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
    this.clinicForm.get('latitude')?.setValue(this.latitude);
    this.clinicForm.get('longitude')?.setValue(this.longitude);

    if (this.clinicForm.valid) {
        const updatedClinic = { ...this.clinicForm.value };
        const image = this.clinicForm.get('image')?.value;

        const selectedDays = this.daysOfWeek
            .filter((_, index) => updatedClinic.openDays[index]) 
            .map(day => day.value) 
            .join(',');

        const clinicData = {
            ...updatedClinic,
            openDays: selectedDays
        };

        // Actualizar datos de la clínica
        this.clinicService.updateClinic(clinicData).subscribe({
            next: () => {
                console.log('Datos de la clínica actualizados correctamente');
                this.showSnackBar('Datos actualizados correctamente');
                this.router.navigate(['/dentist/clinicDetail']);
            },
            error: (error) => {
                const errorMessage = error.error.error;
                this.showSnackBar(errorMessage);

            }
        });

        // Verificar si la imagen fue cambiada antes de actualizarla
        if (image && image !== this.originalImage) {
          this.clinicService.updatePhoto(this.idClinic, image).subscribe({
            next: () => {
              console.log('Imagen de la clínica actualizada correctamente');
              this.showSnackBar('Imagen actualizada correctamente');
              this.router.navigate(['/dentist/clinicDetail']);
            },
            error: (error) => {
              const errorMessage = error.error.error;
              this.showSnackBar(errorMessage);
          }
          });
        }
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
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        this.clinicForm.patchValue({
          image: this.imageFile
        });
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  gotoBack(){
    this.router.navigate(['/dentist/clinicDetail']);
  }
}