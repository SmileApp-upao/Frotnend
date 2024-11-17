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
  cop:string|null="";

  
  constructor() {

    const copValidado = this.sharedDataService.getCop();
    if(copValidado==null)
    {
      const copValidado = localStorage.getItem("copDentista");
    }
    
    this.registerDentistForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      cop: [{ value: copValidado}, [Validators.required,Validators.maxLength(5), Validators.minLength(5)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      studyCenter: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      termsAccepted: [false, Validators.requiredTrue]
    });
    
  }
  ngOnInit(): void {
    this.cop= localStorage.getItem("copDentista");
    this.registerDentistForm.get('cop')?.setValue(this.cop);
    this.registerDentistForm.get('birthday')?.setValue('2000-01-01');
    this.registerDentistForm.get('condition')?.setValue('Profesional');
  }

  onSubmit(){
    if(this.registerDentistForm.valid){
      const userData = this.registerDentistForm.value;
      console.log(userData);
      this.authService.registerDentist(userData).subscribe({
        next: () => {
          localStorage.removeItem("copDentista");
          this.showSnackbar('Registro de Dentista exitoso!');
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          const errorMessage = error?.error?.error;
          this.showSnackbar(errorMessage);
        }
      });
    };

  }
  onSubmit2() {
    if (this.registerDentistForm.valid) {
      const userData = this.registerDentistForm.value;
      console.log(userData);
      this.authService.registerDentist(userData).subscribe({
        next: () => {
          this.showSnackbar('Registro de Dentista exitoso!');
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error durante el registro';
          if (error.error && typeof error.error === 'object') {
            // Si el error es un objeto, intentamos obtener el mensaje
            errorMessage = error.error.message || error.error.error || errorMessage;
          } else if (typeof error.error === 'string') {
            // Si el error es una cadena, la usamos directamente
            errorMessage = error.error;
          }
          this.showSnackbar(errorMessage);
        }
      });
    } else {
      this.showSnackbar('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000,
    });
  }
}
