import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private authService: AuthService
  ) {
    this.clinicForm = this.fb.group({
      name: [''], // Opcional para actualización
      openHour: [''], // Opcional para actualización
      closeHour: [''], // Opcional para actualización
      openDays: [''], // Opcional para actualización
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
      this.isEditMode = condition === 'Profesional';

      // Asigna el ID del dentista, si es requerido por el backend
      const dentistId = profile.id; // Ajusta esto según cómo se obtenga el ID
      this.clinicForm.get('dentistIds')?.setValue([dentistId]);

    });
  }

  onSubmit(): void {
    if (this.clinicForm.valid) {
        const clinicData = { ...this.clinicForm.value };

        // Convertir `openDays` a una cadena separada por comas si es un array
        if (Array.isArray(clinicData.openDays)) {
            clinicData.openDays = clinicData.openDays.join(','); // Convertir a cadena separada por comas
        }

        this.clinicService.updateClinic(clinicData).subscribe({
            next: () => console.log('Clínica actualizada exitosamente'),
            error: error => console.error('Error al actualizar clínica', error)
        });
    } else {
        console.log('Formulario inválido');
    }
}
}