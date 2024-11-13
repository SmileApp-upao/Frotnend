import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SharedDataService } from '../../../core/services/auth/shared-data.service';

@Component({
  selector: 'app-cop-dentist',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './cop-dentist.component.html',
  styleUrl: './cop-dentist.component.scss'
})
export class CopDentistComponent {

  validarCopForm: FormGroup;
  copStatus: string = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private sharedDataService = inject(SharedDataService);

  constructor() {
    this.validarCopForm = this.fb.group({
      cop: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5), Validators.pattern('^[0-9]*$')]],
    });
  }

  onSubmit() {
    if(this.validarCopForm.valid){
      const copValue = this.validarCopForm.get('cop')?.value;

      console.log('Validando COP:', copValue);
      this.authService.validarCop(copValue).subscribe({
        next: (response: string) => {
          console.log('Respuesta del servidor:', response);
          this.copStatus = response;
          if (response.trim() === 'Habilitado') {
            this.sharedDataService.setCop(copValue);
            this.showSnackbar('COP válido y habilitado!');
            this.router.navigate(['/auth/type-acount/type-dentist/validation-cop/register-profesional-dentist']);
          } else {
            this.showSnackbar('COP no habilitado. Por favor, verifique su estado.');
          }
        },
        error: error => {
          console.error('Error al validar COP:', error);
          this.copStatus = 'Error';
          this.showSnackbar('Error al validar. Intente nuevamente.');
        }
      });
    }
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2000,
    });
  }

}
