import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

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
      lastName: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }

  onSubmit() {
    if(this.registerForm.valid){
      const userData = this.registerForm.value;
      userData.dni = parseInt(userData.dni);
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.showSnackbar('Registro exitoso!');
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          this.showSnackbar('Error al registrar. Intente nuevamente.');
        }
      });
    };
    console.log(this.registerForm.value);
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000,
    });
  }

}
