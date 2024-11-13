import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }
  ngOnInit(): void {
    this.registerForm.get('birthday')?.setValue('2000-01-01');
  }
  onSubmit() {
    if(this.registerForm.valid){
      const userData2 = this.registerForm.value;
      console.log(userData2);

      this.authService.registerPatient(userData2).subscribe({
        next: () => {
          this.showSnackbar('Registro exitoso!');
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          const errorMessage = error?.error?.error;
         this.showSnackbar(errorMessage);
        }
      });

    };
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000,
    });
  }

}
