import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ClinicRequest } from '../../../shared/models/clinica/clinica-request-model';

@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.scss']
})
export class AddClinicComponent implements OnInit {
  clinicForm: FormGroup;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private authService: AuthService,
    private router: Router
  ) {
    this.clinicForm = this.fb.group({
      name: [''], // Opcional para actualización
      openHour: [''], // Opcional para actualización
      closeHour: [''], // Opcional para actualización
      openDays: this.fb.array(this.daysOfWeek.map(() => false)), // Opcional para actualización
      address: [''], // Opcional para actualización
      desc: [''], // Opcional para actualización
      telf: [''], // Opcional para actualización
      email: ['', [Validators.email]], // Valida solo formato de email
      latitude: [''],
      longitude: ['']
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

  // Formatea los días seleccionados como un array de strings
  getSelectedDays(): string[] {
    return this.daysOfWeek
      .filter((_, i) => this.openDaysArray.at(i).value)
      .map(day => day.toUpperCase());
  }
 

  onSubmit(): void {
    if (this.clinicForm.valid) {
      const clinicData: Partial<ClinicRequest> = {};

      if (this.clinicForm.get('name')?.value) clinicData.name = this.clinicForm.get('name')?.value;
 
      if (this.clinicForm.get('openHour')?.value) clinicData.openHour = this.clinicForm.get('openHour')?.value;
      if (this.clinicForm.get('closeHour')?.value) clinicData.closeHour = this.clinicForm.get('closeHour')?.value;
      // Verifica y agrega solo los campos con datos
      const selectedDays = this.getSelectedDays();
      if (selectedDays.length > 0) clinicData.openDays = selectedDays.join(',');
      console.log('Dias seleccionados:', selectedDays);
      
      if (this.clinicForm.get('address')?.value) clinicData.address = this.clinicForm.get('address')?.value;
      if (this.clinicForm.get('desc')?.value) clinicData.desc = this.clinicForm.get('desc')?.value;
      if (this.clinicForm.get('telf')?.value) clinicData.telf = this.clinicForm.get('telf')?.value;
      if (this.clinicForm.get('email')?.value) clinicData.email = this.clinicForm.get('email')?.value;
      if (this.clinicForm.get('latitude')?.value) clinicData.latitude = this.clinicForm.get('latitude')?.value;
      if (this.clinicForm.get('longitude')?.value) clinicData.longitude = this.clinicForm.get('longitude')?.value;

      console.log('Datos que se están enviando:', clinicData);
      // Intentar crear la clínica primero
      this.clinicService.updateClinic(clinicData as ClinicRequest).subscribe({
        next: () => {
          console.log('Clínica actualizada exitosamente');
          this.router.navigate(['/dentist/profile']);
        },
        error: (error) => {
          console.error('Error al actulizar clínica:', error);
          // Si la clínica ya existe, intentar actualizar
          if (error?.error === 'La clinica ya existente' || (error?.error?.includes && error.error.includes('La clinica ya existente'))
            || error?.error === 'Cannot invoke "com.jagija.smileapp.model.entity.Clinic.setDesc(String)" because "actuallClinic" is null') {
            console.log('Intentando crear clínica...');
            this.clinicService.addClinic(clinicData as ClinicRequest).subscribe({
              next: () => {
                console.log('Clínica creada exitosamente');
                this.router.navigate(['/dentist/profile']);
              },
              error: updateError => console.error('Error al crear clínica', updateError)
            });
          } else {
            console.error('Error al crear clínica', error);
          }
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}