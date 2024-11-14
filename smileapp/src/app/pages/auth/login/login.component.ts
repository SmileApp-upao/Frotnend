import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AuthRequest } from '../../../shared/models/auth/auth-request-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService); // Importar el servicio de autenticación

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if(this.loginForm.invalid){
      return;
    };

    const credentials: AuthRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
          const role = this.authService.getUser()?.role; // Extrae el rol directamente
          if (role === 'PATIENT') {
              this.router.navigateByUrl('/patient');
          } else if (role === 'DENTIST') {
              this.router.navigateByUrl('/dentist');
          } else {
              this.showSnackbar('Rol no reconocido.');
          }
      },
      error: (error) => {
        const errorMessage = error?.error?.error;
         this.showSnackbar(errorMessage);
      }
  });
    this.showSnackbar('Inicio de sesion exitoso!');
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
    this.showSnackbar('Cierre de sesion exitoso!');
  }

  private showSnackbar(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000
    });
  }
}
