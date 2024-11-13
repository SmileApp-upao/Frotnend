import { Component, inject } from '@angular/core';
import { PatientResponse } from '../../../../models/user/patient/patient-response-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../../../core/services/user/patient/patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent {
  public UserProfile!: PatientResponse;
  private snackbar = inject(MatSnackBar);
  private patientService = inject(PatientService)
  private fb = inject(FormBuilder);
  private router=inject(Router)
  updateUserForm!: FormGroup;
  existEmercency : boolean = false;

}
