import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicRequest } from '../../../shared/models/clinica/clinica-request-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-clinic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-clinic.component.html',
  styleUrl: './edit-clinic.component.scss'
})
export class EditClinicComponent implements OnInit {
  clinicForm: FormGroup;
  clinicId!: number;

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.clinicForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      latitude: [''],
      longitude: [''],
      openHour: ['', Validators.required],
      closeHour: ['', Validators.required],
      openDays: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clinicId = +this.route.snapshot.paramMap.get('id')!;
    this.clinicService.getClinicById(this.clinicId).subscribe((clinic: ClinicRequest) => {
      this.clinicForm.patchValue({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.telf,
        email: clinic.email,
        description: clinic.desc,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        openHour: clinic.openHour,
        closeHour: clinic.closeHour,
        openDays: clinic.openDays
      });
    });
  }

  onSubmit() {
    if (this.clinicForm.valid) {
      const clinicData = this.clinicForm.value;
      this.clinicService.updateClinic(clinicData).subscribe({
        next: () => this.router.navigate(['/dentist/profile']),
        error: (error) => console.error('Error al actualizar el consultorio', error)
      });
    }

  }
}
