import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SharedDataService } from '../../../core/services/auth/shared-data.service';

@Component({
  selector: 'app-register-profesional-dentist',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './register-profesional-dentist.component.html',
  styleUrl: './register-profesional-dentist.component.scss'
})
export class RegisterProfesionalDentistComponent {

  registerDentistForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private sharedDataService = inject(SharedDataService);

  constructor() {

    const copValidado = this.sharedDataService.getCop();
    this.registerDentistForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      cop: [{ value: copValidado, disabled: true }, [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      studyCenter: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }

  onSubmit(){
    if(this.registerDentistForm.valid){
      const userData = this.registerDentistForm.value;
      this.authService.registerDentist(userData).subscribe({
        next: () => {
          this.showSnackbar('Registro de Dentista exitoso!');
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
