import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicRequestDTO } from '../../../shared/models/clinica/clinica-request-model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare const google: any;
@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.scss']
})

export class AddClinicComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  map: any;
  marker: any;
  imagePreview: SafeUrl | null = null;

  private sanitizer = inject(DomSanitizer);


  clinicForm: FormGroup;
  daysOfWeek = [
    { value: 'MONDAY', label: 'Lunes' },
    { value: 'TUESDAY', label: 'Martes' },
    { value: 'WEDNESDAY', label: 'Miércoles' },
    { value: 'THURSDAY', label: 'Jueves' },
    { value: 'FRIDAY', label: 'Viernes' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];

  isEditMode = true;
  

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar)
  {
    this.clinicForm = this.fb.group({
      name: ['', [Validators.maxLength(255), Validators.required]], // Máximo 255 caracteres
      openHour: ['', [Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/), Validators.required]], 
      closeHour: ['', [Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/), Validators.required]],
      openDays: this.fb.array(
        this.daysOfWeek.map(() => this.fb.control(false)) , 
        [this.atLeastOneCheckboxChecked()]
      ),
      address: ['', [Validators.maxLength(255), Validators.required]], 
      desc: ['', [Validators.maxLength(500), Validators.required]], 
      telf: ['', [
        Validators.pattern(/^\d+$/), // Solo números
        Validators.minLength(9), // Mínimo 4 caracteres
        Validators.maxLength(15), // Máximo 15 caracteres
        Validators.required
      ]],
      email: ['', [Validators.email, Validators.maxLength(100), Validators.required]],
      latitude: ['', [
        Validators.pattern(/^[-+]?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/), // Latitud: -90 a 90
        Validators.required
      ]],
      longitude: ['', [
        Validators.pattern(/^[-+]?([1]?[0-7]?[0-9](\.[0-9]+)?|180(\.0+)?)$/), // Longitud: -180 a 180
        Validators.required
      ]],
      image:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeMap();
    this.clinicForm.get('latitude')?.setValue(this.latitude);
    this.clinicForm.get('longitude')?.setValue(this.longitude);
    this.authService.getUserProfile().subscribe(profile => {
      const condition = profile.condition;
      console.log('Perfil del usuario:', profile);
      console.log('Condicion: ', condition)
    });
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

  getErrorMessage(controlName: string): string {
    const control = this.clinicForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('maxlength')) {
      return `Este campo excede el máximo de caracteres permitidos`;
    }
    if (controlName === 'email' && control?.hasError('email')) {
      return 'El email debe ser válido';
    }
    if (controlName === 'telf' && control?.hasError('pattern')) {
      return 'El teléfono debe contener entre 4 a 15 dígitos';
    }
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (controlName === 'latitude' && control?.hasError('pattern')) {
      return 'Ingrese una latitud válida (-90 a 90, en formato decimal)';
    }
    if (controlName === 'longitude' && control?.hasError('pattern')) {
      return 'Ingrese una longitud válida (-180 a 180, en formato decimal)';
    }
    return '';
  }


  onSubmit(): void {
    
    this.clinicForm.get('latitude')?.setValue(this.latitude);
    this.clinicForm.get('longitude')?.setValue(this.longitude);
    console.log(this.clinicForm.value);
    if (this.clinicForm.valid) {
      const formValues = this.clinicForm.value;
  

      const selectedDays = this.daysOfWeek
        .filter((_, index) => formValues.openDays[index]) 
        .map(day => day.value) 
        .join(','); 
  
      const clinicData = {
        ...formValues,
        openDays: selectedDays 
      };
  
      console.log('Datos transformados:', clinicData);
  
      this.clinicService.addClinic(clinicData).subscribe({
        next: () => {
          this.showSnackBar('Clínica creada exitosamente');
          this.router.navigate(['/dentist/profile']); // Navega al perfil
        },
        error: (error) => {
          const errorMessage = error?.error?.error;
         this.showSnackBar(errorMessage);
        }
      });
    } else {
      console.log(this.clinicForm.value);
      this.showSnackBar('Formulario inválido');
    }
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

  private showSnackBar(message:string) : void{
    this.snackBar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
  
  atLeastOneCheckboxChecked(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const hasAtLeastOneChecked = formArray.controls.some(ctrl => ctrl.value === true);
  
      return hasAtLeastOneChecked ? null : { required: true };
    };
  }

}
