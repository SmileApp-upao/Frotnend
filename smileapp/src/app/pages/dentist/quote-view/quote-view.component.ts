import { Component } from '@angular/core';
import { PatientService } from '../../../core/services/user/patient/patient.service';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../../core/services/pdf/pdf.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-quote-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-view.component.html',
  styleUrl: './quote-view.component.scss'
})
export class QuoteViewComponent {
  patientId!: number;
  quoteId!: number;
  patientDetails: any = null;
  patientImage: SafeUrl | null = null;

  appointmentDate: string | null = null;
  appointmentTime: string | null = null;
  reason: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private pdfService: PdfService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patientId'];
      this.quoteId = params['quoteId'];

      // Capturamos los nuevos parámetros
      this.appointmentDate = new Date(params['appointmentDate']).toLocaleDateString('es-PE');
      this.appointmentTime = new Date(params['appointmentTime']).toLocaleTimeString('es-PE');
      this.reason = params['reason'];

      console.log('quoteId:', this.quoteId);
      console.log('Datos adicionales:', {
        appointmentDate: this.appointmentDate,
        appointmentTime: this.appointmentTime,
        reason: this.reason,
      });

      // Cargar los detalles e imagen del paciente si tenemos el ID
      if (this.patientId) {
        this.loadPatientDetails(this.patientId);
      }

    });
  }

  // Cargar los detalles del paciente usando el patientId
  loadPatientDetails(patientId: number): void {
    this.patientService.getUserbyID(patientId).subscribe((response) => {
      this.patientDetails = response;
      console.log("Datos del paciente: ", this.patientDetails);
      this.quoteId = this.patientDetails.id;
    });
  }

  // Cargar la imagen del paciente


  downloadPdf(): void {
    const pacienteId = parseInt(localStorage.getItem("PacienteId") || '0', 10);
    const citaId = parseInt(localStorage.getItem("CitaId") || '0', 10);

    if (this.patientId, this.quoteId) {
      this.pdfService.downloadPdf(this.patientId, this.quoteId).subscribe({
        next: (response) => {
          if (response instanceof Blob) {
            const blob = response;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte-cita-paciente.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
            console.error('Respuesta inesperada:', response);
          }
        },
        error: (err) => {
          console.error('Error al descargar el PDF:', err);
        },
      });
    }
  }
}