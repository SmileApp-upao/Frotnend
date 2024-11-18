import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitasResponse } from '../../../shared/models/cita/citas.response.model';
import { CitaService } from '../../../core/services/cita/cita.service';
import { SortCitasPipe } from '../../../core/pipes/order-citas.pipe';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [SortCitasPipe,CommonModule,RouterLink,FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent {
  private dentistService= inject(DentistService);
  private sanitizer = inject(DomSanitizer);
  dentista!:DentistResponse;
  miscitas:CitasResponse[]=[];
  filtercitas: CitasResponse[] = [];
  dentistImages = new Map<number, string>();
  defaultImage = 'https://banffventureforum.com/wp-content/uploads/2019/08/no-photo-icon-22.png';
  searchQuery: string = '';
  private citaService= inject(CitaService);
  private router = inject(Router)
  imagePreview: SafeUrl | null = null;
  ngOnInit(): void {
  
    this.citaService.myCitas().subscribe({
      next:(cita) => {
        this.miscitas = cita;
        this.filtercitas=cita;
        
        console.log(this.miscitas);
        this.loadDentistImages();
      
      },
      error:(error) => console.log('No tienes Citas',error)
    });;

  }

  loadDentistImages(): void {
    this.filtercitas.forEach((cita) => {
      const dentistUserId = cita.dentistUserId;

      // Verifica si ya se cargó la imagen de este dentista
      if (!this.dentistImages.has(dentistUserId)) {
        this.dentistService.getUserbyID(dentistUserId).subscribe({
          next: (dentist) => {
            if (dentist.image) {
              // Convierte el Blob a una URL y guárdala en el mapa
              this.loadUserImage(dentist.image).then((url) => {
                this.dentistImages.set(dentistUserId, url);
              });
            } else {
              // Usa la imagen por defecto si no hay imagen
              this.dentistImages.set(dentistUserId, this.defaultImage);
            }
          },
          error: (err) => {
            console.error(`Error cargando el dentista con ID ${dentistUserId}`, err);
            this.dentistImages.set(dentistUserId, this.defaultImage);
          },
        });
      }
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
          //this.showSnackBar('Error al cargar la imagen del usuario');
          reject(error);
        }
      });
    });
  }

  onSearch(): void {
    const query = this.searchQuery; 
    if (!this.searchQuery) {
      this.filtercitas = this.miscitas;
    } else {
      this.filtercitas = this.miscitas.filter(cita => cita.date === query);
    }
  }
  clearFilter(): void {
    this.searchQuery = '';
    this.filtercitas = [...this.miscitas];
  }
  filterToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.filtercitas = this.miscitas.filter(cita => cita.date === today);
  }

  isPast(date:string,hour:string):boolean{
    const today = new Date().getTime(); 
    const dateofquote=  new Date(`${date}T${hour}`).getTime();
    return dateofquote < today; // Compara los timestamps

  }
  filterTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    this.filtercitas = this.miscitas.filter(cita => cita.date === tomorrowStr);
  }

  filterThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay())));

    this.filtercitas = this.miscitas.filter(cita => {
      const citaDate = new Date(cita.date);
      return citaDate >= startOfWeek && citaDate <= endOfWeek;
    });
  }

  filterNextWeek(): void {
    const today = new Date();
    const startOfNextWeek = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    this.filtercitas = this.miscitas.filter(cita => {
      const citaDate = new Date(cita.date);
      return citaDate >= startOfNextWeek && citaDate <= endOfNextWeek;
    });
  }

  buscarImg(dentistUserId:number)
  {
    this.dentistService.getUserbyID(dentistUserId).subscribe({
      next: (dentist) => {
        this.dentista = dentist;
        console.log(this.dentista)
        if (this.dentista.image != null) {
          this.loadUserImage(this.dentista.image).then((url) => {
            console.log(this.dentista.image)
            this.dentista.image = url; // Actualiza la URL procesada
            this.imagePreview=url;
            console.log(this.dentista.image)
            console.log(this.dentista)
          });
        }
      }
    }
   );
  }
}