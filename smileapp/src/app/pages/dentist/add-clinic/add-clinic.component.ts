import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicRequestDTO } from '../../../shared/models/clinica/clinica-request-model';

@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.scss']
})
export class AddClinicComponent implements OnInit {
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
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clinicForm = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.maxLength(255)]], // Máximo 255 caracteres
      openHour: [{ value: '', disabled: true }, [Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]], 
      closeHour: [{ value: '', disabled: true }, [Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]],
      openDays: this.fb.array(this.daysOfWeek.map(() => this.fb.control({ value: false, disabled: true }))), 
      address: [{ value: '', disabled: true }, [Validators.maxLength(255)]], 
      desc: [{ value: '', disabled: true }, [Validators.maxLength(500)]], 
      telf: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]{4,15}$/)]], 
      email: [{ value: '', disabled: true }, [Validators.email, Validators.maxLength(100)]],
      latitude: [{ value: '', disabled: true }, [Validators.pattern(/^[-+]?[0-9]{1,2}\.[0-9]+$/)]], // Formato decimal
      longitude: [{ value: '', disabled: true }, [Validators.pattern(/^[-+]?[0-9]{1,3}\.[0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(profile => {
      const condition = profile.condition;
      console.log('Perfil del usuario:', profile);
      console.log('Condicion: ', condition)
    });
  }


  get openDaysArray(): FormArray {
    return this.clinicForm.get('openDays') as FormArray;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.clinicForm.enable();
      this.openDaysArray.controls.forEach(control => control.enable());
    } else {
      this.clinicForm.disable();
      this.openDaysArray.controls.forEach(control => control.disable());
    }
  }

  // Formatea los días seleccionados como un array de strings
  getSelectedDays(): string[] {
    return this.daysOfWeek
      .filter((_, i) => this.openDaysArray.at(i).value)
      .map(day => day.value);
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
    return '';
  }

  onSubmit(): void {
    if (this.clinicForm.valid) {
      const clinicData: Partial<ClinicRequestDTO> = {};

      if (this.clinicForm.get('name')?.value) clinicData.name = this.clinicForm.get('name')?.value;

      if (this.clinicForm.get('openHour')?.value) clinicData.openHour = this.clinicForm.get('openHour')?.value;
      if (this.clinicForm.get('closeHour')?.value) clinicData.closeHour = this.clinicForm.get('closeHour')?.value;
      // Verifica y agrega solo los campos con datos
      const selectedDays = this.getSelectedDays();
      if (selectedDays.length > 0) clinicData.openDays = selectedDays.join(','); 

      if (this.clinicForm.get('address')?.value) clinicData.address = this.clinicForm.get('address')?.value;
      if (this.clinicForm.get('desc')?.value) clinicData.desc = this.clinicForm.get('desc')?.value;
      if (this.clinicForm.get('telf')?.value) clinicData.telf = this.clinicForm.get('telf')?.value;
      if (this.clinicForm.get('email')?.value) clinicData.email = this.clinicForm.get('email')?.value;
      if (this.clinicForm.get('latitude')?.value) clinicData.latitude = this.clinicForm.get('latitude')?.value;
      if (this.clinicForm.get('longitude')?.value) clinicData.longitude = this.clinicForm.get('longitude')?.value;

      this.clinicService.updateClinic(clinicData as ClinicRequestDTO).subscribe({
        next: () => {
          this.snackBar.open('Clínica actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }); 
          this.router.navigate(['/dentist/profile']);
        },
        error: (error) => { 
          this.snackBar.open('Error al actualizar clínica', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }); 

          const authData = this.storageService.getAuthData();
          const token = authData ? authData.token : null; 
          if (token) {
            // Pasar el token a addClinic
            this.clinicService.addClinic(clinicData as ClinicRequestDTO, token).subscribe({
              next: () => {
                this.snackBar.open('Clínica creada exitosamente', 'Cerrar', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                }); 
                this.router.navigate(['/dentist/profile']);
              },
              error: createError => { 
                this.snackBar.open('Error al crear clínica', 'Cerrar', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              }
            });
          } else { 
            this.snackBar.open('Error: No se pudo obtener el token', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
        }
      });
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      }); 
    }
  }
}