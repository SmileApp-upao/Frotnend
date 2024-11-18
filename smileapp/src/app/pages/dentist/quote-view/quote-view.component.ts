import { Component } from '@angular/core';
import { PatientService } from '../../../core/services/user/patient/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '../../../core/services/pdf/pdf.service';

@Component({
  selector: 'app-quote-view',
  standalone: true,
  imports: [],
  templateUrl: './quote-view.component.html',
  styleUrl: './quote-view.component.scss'
})
export class QuoteViewComponent {
  patientId: number | null = null;
  quoteId: number | null = null;
  patientDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService, // Servicio para obtener la información del paciente
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    // Obtenemos el patientId desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patientId']; // Recuperamos el patientId pasado desde CalendarComponent
      this.quoteId = params['quoteId'];
      console.log("quote id:", this.quoteId);
      if (this.patientId) {
        this.loadPatientDetails(this.patientId); // Cargamos la información del paciente
      }
    });
  }

  // Método para cargar los detalles del paciente usando el patientId
  loadPatientDetails(patientId: number): void {
    this.patientService.getUserbyID(patientId).subscribe((response) => {
      this.patientDetails = response; // Guardamos la información del paciente
      console.log("Datos del paciente: ", this.patientDetails)
    });
  }

  downloadPdf(): void {
    if (this.patientId && this.quoteId) {
      this.pdfService.downloadPdf(this.patientId, this.quoteId).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte-cita-paciente.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el PDF:', err);
        },
      });
    }
  }
}
