import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic/clinic.service';

@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.scss']
})
export class AddClinicComponent {
  clinicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clinicService: ClinicService
  ) {
    this.clinicForm = this.fb.group({
      name: ['', Validators.required],
      openHour: ['', Validators.required],
      closeHour: ['', Validators.required],
      openDays: ['', Validators.required],
      address: ['', Validators.required],
      desc: ['', Validators.required],
      telf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      dentistIds: [[], Validators.required]
    });
  }

  onSubmit() {
    if (this.clinicForm.valid) {
      this.clinicService.addClinic(this.clinicForm.value).subscribe({
        next: (response) => {
          console.log('Clinic added successfully', response);
          this.router.navigate(['/dentist/edit-clinic']);
        },
        error: (error) => {
          console.error('Error adding clinic', error);
        }
      });
    }
  }
}