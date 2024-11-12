
import { Component, inject, OnInit } from '@angular/core';
import {citaModel} from "../../../shared/models/cita/cita.model"
import { FormBuilder, FormGroup, Validators ,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita/cita.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { C, E } from '@angular/cdk/keycodes';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
@Component({
  selector: 'app-cita-details',
  standalone: true,
  imports: [CommonModule,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cita-details.component.html',
  styleUrl: './cita-details.component.scss'
})
export class CitaDetailsComponent {
  clinicresponse!: ClinicaResponse;
  quoteForm!: FormGroup;
  clinicId: number=0;
  selectedDentistId: number = 0;  // Este id se asignará manualmente
  submitSuccess: boolean = false;
  private router = inject(Router);
  private citaService = inject(CitaService);
  private clinicaService = inject(ClinicService);
  private snackbar = inject(MatSnackBar);
  constructor(private fb: FormBuilder) {}
  minDate: string="";
  clinicOpenHour : string=""; 
  clinicCloseHour: string=""; 
  clinicOpenDays:string[]=[]; 

  ngOnInit(): void {
    console.log(localStorage.getItem('selectedDentistId'))

    this.clinicId =parseInt( localStorage.getItem('selectedClinicId') || "",10);

    if(localStorage.getItem('selectedDentistId')!=null)
    {

      this.selectedDentistId= parseInt(localStorage.getItem('selectedDentistId') || '', 10);

    }
    this.clinicaService.getClinicById(this.clinicId).subscribe(
      {
        next:(clinic) =>{
          this.clinicresponse=clinic;
          this.clinicOpenHour=clinic.openHour;
          this.clinicCloseHour=clinic.closeHour;
          this.clinicOpenDays=clinic.openDays;
          console.log("Clinica obtenido correctamente")
        }
        ,error: (error) =>
        {
          console.log("Error al obtener la clinica",error.error.message)
        }
      }
    );
    this.quoteForm = this.fb.group({
      reason: ['', [Validators.required, Validators.maxLength(255)]],
      date: ['', Validators.required],
      hour: ['', Validators.required],
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Asegura que esté en el inicio del día.
    this.minDate = today.toISOString().split('T')[0];
  }

  // Obtener los campos del formulario
  get reason() {
    return this.quoteForm.get('reason');
  }

  get date() {
    return this.quoteForm.get('date');
  }

  get hour() {
    return this.quoteForm.get('hour');
  }

  // Enviar la solicitud de cita
  onSubmit(): void {
    if (this.quoteForm.valid && this.validateAppointment()) {
    console.log('Formulario válido y listo para enviar:', this.quoteForm.value);
    
    const quoteRequest: citaModel = {
      dentistId :this.selectedDentistId,
      reason: this.quoteForm.value.reason,
      date: this.quoteForm.value.date,
      hour: this.quoteForm.value.hour
    };
    this.citaService.createCita(quoteRequest).subscribe(
      {
        next:() =>
        {
          this.showSnackBar('Cita creada exitosamente.');
          this.router.navigate(["/patient/MisCitas"]);
          this.submitSuccess = true;
        },
        error: (error) => {
          const errorMessage = error.error['error:'] || 'Ocurrió un error al crear la cita';
          console.log('Error al crear la cita:', errorMessage);
          this.showSnackBar(errorMessage);
        }
      }
    );
    
    } 
  }

  Volver():void
  {
    this.router.navigate(["patient/cita/dentista"])
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }

  validateAppointment() {
    const dateControl = this.date?.value;
    const hourControl = this.hour?.value;

    if (!dateControl || !hourControl) return false;


    const appointmentDate = new Date(dateControl);
    const appointmentDay = appointmentDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    if (!this.clinicOpenDays.includes(appointmentDay)) {
    
      this.showSnackBar('La clínica no abre en el día seleccionado.');
      return false;
    }

    // Validar la hora de la cita
    if (hourControl < this.clinicOpenHour || hourControl > this.clinicCloseHour) {
      this.showSnackBar('La clínica solo atiende entre las ' + this.clinicOpenHour + ' y ' + this.clinicCloseHour + '.');
      return false;
    }

    // Validar que la fecha y la hora sean en el futuro
    const appointmentDateTime = new Date(`${dateControl}T${hourControl}`);
    if (appointmentDateTime <= new Date()) {
      this.showSnackBar('La fecha y hora de la cita deben ser en el futuro.');
      return false;
    }

    return true;
  }

}
