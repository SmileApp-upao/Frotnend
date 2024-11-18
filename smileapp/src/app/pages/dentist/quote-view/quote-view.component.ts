import { Component, inject } from '@angular/core';
import { PatientService } from '../../../core/services/user/patient/patient.service';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../../core/services/pdf/pdf.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientResponse } from '../../../shared/models/user/patient/patient-response-model';
import { CitaService } from '../../../core/services/cita/cita.service';
import { CitasResponse } from '../../../shared/models/cita/citas.response.model';

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
  patientDetails!: PatientResponse;
  patientImage: SafeUrl | null = null;
  citaDetails!: CitasResponse;
  appointmentDate: string | null = null;
  appointmentTime: string | null = null;
  reason: string | null = null;
  imagePreview: SafeUrl | null = null;
  citaImages:string[]=[];
  private snackbar = inject(MatSnackBar);
  private patienService = inject(PatientService);
  private citaService= inject(CitaService);
  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private pdfService: PdfService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patientId'];
      this.quoteId = params['citaId'];
      console.log("id cita",this.quoteId);
      console.log("Id de usuario",this.patientId);
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
      if (this.quoteId) {
        this.citaService.CitaByCitaId(this.quoteId).subscribe({
          next: (cita) => {
            this.citaDetails = cita;
            console.log(cita);
    
            // Cargar las imágenes
            this.loadImages();
          },
          error: (err) => console.error('Error cargando la cita', err),
        });
      }
    });
  }

  //cargar imagenes de la cita:
  loadImages(): void {
    if (this.citaDetails?.filePaths) {
      this.citaImages = []; // Inicializar el array de imágenes
  
      this.citaDetails.filePaths.forEach((filename: string) => {
        this.citaService.viewPhoto(filename).subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob); // Crear una URL para el Blob
            this.citaImages.push(url); // Guardar la URL en el array
          },
          error: (err) => console.error(`Error cargando la imagen ${filename}`, err),
        });
      });
    }
  }
  // Cargar los detalles del paciente usando el patientId
  loadPatientDetails(patientId: number): void {
    this.patientService.getUserbyID(patientId).subscribe((response) => {
      this.patientDetails = response;
      this.loadUserImage(this.patientDetails.image);
      console.log("Datos del paciente: ", this.patientDetails);
      
    });
  }
  loadUserImage(filename: string): void {
    this.patienService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('Image URL:', this.imagePreview);
      },
      error: (error) => {
        console.error('Error al cargar la imagen del usuario', error);
        this.showSnackBar('Error al cargar la imagen del usuario');
      }
    });
  }
  // Cargar la imagen del paciente

  loadCitaImagen(filename: string): void {
    this.patienService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('Image URL:', this.imagePreview);
      },
      error: (error) => {
        console.error('Error al cargar la imagen del usuario', error);
        this.showSnackBar('Error al cargar la imagen del usuario');
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 2000,
      verticalPosition: 'top',
    });

  }
  downloadPdf(): void {
    if (this.patientId, this.quoteId) {
      console.log(this.patientId, this.quoteId)
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