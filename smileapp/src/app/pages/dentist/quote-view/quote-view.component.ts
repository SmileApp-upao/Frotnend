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
  patientId: number | null = null;
  quoteId: number | null = null;
  patientDetails: any = null;
  patientImage: SafeUrl | null = null;  // Cambié a patientImage para manejar una sola imagen

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private pdfService: PdfService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patientId']; // Recuperamos el patientId pasado desde CalendarComponent
      this.quoteId = params['quoteId'];
      console.log("quote id:", this.quoteId);
      if (this.patientId) {
        this.loadPatientDetails(this.patientId);
        this.loadPatientImage(this.patientId);  // Cambié a loadPatientImage para manejar la imagen
      }
    });
  }

  // Cargar los detalles del paciente usando el patientId
  loadPatientDetails(patientId: number): void {
    this.patientService.getUserbyID(patientId).subscribe((response) => {
      this.patientDetails = response; // Guardamos la información del paciente
      console.log("Datos del paciente: ", this.patientDetails);
      this.quoteId = this.patientDetails.id;
    });
  }

  // Cargar la imagen del paciente
  loadPatientImage(patientId: number): void {
    this.patientService.getPatientProfile(patientId).subscribe((response) => {
      if (response && response.image) {
        const imageUrl = response.image;
        this.patientService.viewPhoto(imageUrl).subscribe((imageBlob) => {
          const objectUrl = URL.createObjectURL(imageBlob);  // Creamos la URL de la imagen
          this.patientImage = this.sanitizer.bypassSecurityTrustUrl(objectUrl);  // Sanitizamos la URL para usarla en el HTML
        });
      }
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