import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
@Component({
  selector: 'app-List-of-Dentist',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './List-of-Dentist.component.html',
  styleUrl: './List-of-Dentist.component.scss'
})
export class ListofdentistComponent {
  clinicId: string = "";
  clinica!: ClinicaResponse;
  dentista!:DentistResponse;
  dentistas:DentistResponse[]=[];
  filterDentist: DentistResponse[] = [];
  cycles: number[] = [5, 6, 7, 8, 9, 10]; 
  
  imagePreview: SafeUrl | null = null;

  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar);
  private dentistService= inject(DentistService);

  searchQuery: string = '';

  private clinicService= inject(ClinicService);
  private router = inject(Router)

  ngOnInit(): void {
    this.clinicId = localStorage.getItem('selectedClinicId') || "";
    this.clinicService.getClinicById(+this.clinicId).subscribe({
      next: (clinic) => {
        this.clinica = clinic;
        this.dentistas = clinic.dentists;
  
        // Procesar imágenes
        this.dentistas.forEach(dentist => {
          this.loadUserImage(dentist.image).then(imageUrl => {
            dentist.image = imageUrl || 'https://i.imgur.com/m0gM5xy.jpeg';
          }).catch(() => {
            dentist.image = 'https://i.imgur.com/m0gM5xy.jpeg';
          });
        });
  
        this.filterDentist = this.dentistas;
      },
      error: (error) => console.log('Error al cargar la clínica', error)
    });
  }
  
  loadUserImage(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dentistService.viewPhoto(filename).subscribe({
        next: (imageBlob: Blob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL) as string;
          resolve(sanitizedUrl); // Resolver con la URL generada
        },
        error: (error) => {
          console.error('Error al cargar la imagen del usuario', error);
          this.showSnackBar('Error al cargar la imagen del usuario');
          reject(error);
        }
      });
    });
  }
  onSearch(): void {
    const query = Number(this.searchQuery); 
    if (!this.searchQuery) {
      this.filterDentist = this.dentistas;
    } else {
      this.filterDentist = this.dentistas.filter(dentist => dentist.cicle === query);
    }
  }

  fetchDentistDetails(dentistId: number): void {
    this.dentistService.getUserbyID(dentistId).subscribe({
      next: (dentist) => {
        this.dentista = dentist;
        if (this.dentista.image != null) {
          this.loadUserImage(this.dentista.image);
        }
        console.log(dentist);
      },
      error: (error) => console.log('Error al cargar el dentista', error)
    });
  }

 

  clearFilter(): void {
    this.searchQuery = '';
    this.filterDentist = [...this.dentistas]; // Restablecemos la lista completa
  }

  DentistDetails(dentistId: number,userId :number): void {
    localStorage.setItem('selectedDentistId', dentistId.toString());
    localStorage.setItem('SelecterUserId',userId.toString())
    console.log("id seleccionado: " , dentistId)
    this.router.navigate(['patient/cita/dentistas/dentista'])
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
}
