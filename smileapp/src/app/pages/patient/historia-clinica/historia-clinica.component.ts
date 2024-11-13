import { Component, inject } from '@angular/core';
import { FormGroup,FormBuilder, FormsModule,Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/user/patient/patient.service';
import { HistoriaClinicalRequest } from '../../../shared/models/user/patient/history-clinical-request-model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.scss'
})
export class HistoriaClinicaComponent {
  private snackbar = inject(MatSnackBar);
  private patientService = inject(PatientService)
  private fb = inject(FormBuilder);
  private router=inject(Router)
  historyForm!: FormGroup;
  ngOnInit()
  {
    this.historyForm = this.fb.group({
      bloodType: ['', [Validators.required, Validators.maxLength(3)]],
      rh: ['', [Validators.required, Validators.maxLength(2)]],
      civilState: ['', [Validators.required, Validators.maxLength(20)]],
      birthPlace: ['', [Validators.required, Validators.maxLength(50)]],
      dir: ['', [Validators.required, Validators.maxLength(100)]],
      studyGrade: ['', [Validators.required, Validators.maxLength(50)]],
      profession: ['', [Validators.required, Validators.maxLength(50)]],
      occupation: ['', [Validators.required, Validators.maxLength(50)]],
      workCenter: ['', [Validators.required, Validators.maxLength(100)]],
      workDir: ['', [Validators.required, Validators.maxLength(100)]],
      religion: ['', [Validators.required, Validators.maxLength(30)]],
      home: ['', [Validators.required, Validators.maxLength(100)]],
      raze: ['', [Validators.required, Validators.maxLength(30)]],
      residentime: ['', Validators.required]
    });
  }

   // Enviar la solicitud de cita
   onSubmit(): void {
    if (this.historyForm.valid) {
      console.log('Formulario válido y listo para enviar:', this.historyForm.value);

      const historyRequest: HistoriaClinicalRequest = {
        ...this.historyForm.value
      };

      this.patientService.createHistoryClinical(historyRequest).subscribe({
        next: () => {
          this.showSnackBar('Cita creada exitosamente.');
          this.router.navigate(["/patient"]);
        },
        error: (error) => {
          const errorMessage = error.error['error:'] || 'Ocurrió un error al crear la cita';
          console.log('Error al crear la cita:', errorMessage);
          this.showSnackBar(errorMessage);
        }
      });
    } 
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
}
