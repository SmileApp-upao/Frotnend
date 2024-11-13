import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register-estudent-dentist',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './register-estudent-dentist.component.html',
  styleUrl: './register-estudent-dentist.component.scss'
})
export class RegisterEstudentDentistComponent {

  registerEstudentForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);

  constructor() {
    this.registerEstudentForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      cicle: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      studyCenter: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }

  onSubmit(){
    if(this.registerEstudentForm.valid){
      const userData = this.registerEstudentForm.value;
      this.authService.registerEstudentDentist(userData).subscribe({
        next: () => {
          this.showSnackbar('Registro de Estudiante exitoso!');
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          this.showSnackbar('Error al registrar. Intente nuevamente.');
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
