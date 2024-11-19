import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostResponse } from '../../../shared/models/post/post.response.model';
import { PostService } from '../../../core/services/posts-j/posts-service';
import { profileResponse } from '../../../shared/models/user/user-profile-model';
import { ContentObserver } from '@angular/cdk/observers';
@Component({
  selector: 'app-dentist-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dentist-details.component.html',
  styleUrl: './dentist-details.component.scss'
})
export class DentistDetailsComponent {
  profileResponse!:profileResponse;
  clinicId: string = "";
  clinica!: ClinicaResponse;
  dentista!:DentistResponse;
  imagePublicationview: SafeUrl | null = null;
  post : PostResponse[]=[];
  dentistId: number | null = null; 
  userId!:number;
  hover: boolean = false;
  private clinicService= inject(ClinicService);
  private dentistService= inject(DentistService);
  private router = inject(Router);
  imagePreview: SafeUrl | null = null;

  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar); 
  private postService= inject(PostService);
  
  ngOnInit(): void 
  { 
    this.post.forEach((post) => {
      if (post.image) {
        this.loadUserImage(post.image).then((url) => {
          post.processedImage = url;
        }).catch(() => {
          post.processedImage = 'https://via.placeholder.com/150';
        });
      } else {
        post.processedImage = 'https://via.placeholder.com/150';
      }
    });


    
    if(localStorage.getItem('selectedDentistId')!=null)
    {
      this.postService.getPostByDentistId( parseInt(localStorage.getItem('selectedDentistId') || '', 10)).subscribe({

        next :(posts) =>
        { 
          this.post=posts;
        },
        error : (error)=>
        {
          this.showSnackBar(error?.error?.value)
        }
  
      });

      this.dentistId= parseInt(localStorage.getItem('selectedDentistId') || '', 10);
      
      console.log("id seleccionado: " , this.dentistId)
      this.clinicId = localStorage.getItem('selectedClinicId') || "";
      this.clinicService.getClinicById(+this.clinicId).subscribe({
        next: (clinic) => {
          this.clinica = clinic;
        },
        error: (error) => console.log('Error al cargar la clinica', error)
        
      });

      this.fetchDentistDetails( parseInt(localStorage.getItem('selectedDentistId') || '', 10));

      // Procesar imágenes
      this.post.forEach(post => {
        this.loadUserImage(post.image).then(imageUrl => {
          post.image = imageUrl;
        }).catch(() => {

        });
      });

    }
    else{
      console.log("Flujo dentista profesional")

      this.clinicId = localStorage.getItem('selectedClinicId') || "";

    this.clinicService.getClinicById(+this.clinicId).subscribe({
      next: (clinic) => {
        this.clinica = clinic;
        console.log(clinic);
        if (this.clinica.dentists && this.clinica.dentists.length > 0) {
          this.userId = this.clinica.dentists[0].userId;
          this.dentistId = this.clinica.dentists[0].id;

          this.fetchDentistDetails(this.dentistId);

          console.log(this.dentistId);

          this.postService.getPostByDentistId(this.dentistId).subscribe({
            next: (posts) => {
              this.post = posts;
    
              // Procesar las imágenes de los posts
              this.post.forEach((post: any) => {
                if (post.image) {
                  this.loadUserImage(post.image).then((url) => {
                    post.processedImage = url; // Asigna la imagen procesada
                  }).catch(() => {
                    post.processedImage = 'https://via.placeholder.com/150'; // Imagen por defecto si falla
                  });
                } else {
                  post.processedImage = 'https://via.placeholder.com/150'; // Imagen por defecto si no hay imagen
                }
              });
            },
            error: (error) => {
              this.showSnackBar(error?.error?.value);
            },
          });

        }
      },
      error: (error) => console.log('Error al cargar la clinica', error)
    });
    }

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



  fetchDentistDetails(dentistId: number): void {
    if(localStorage.getItem('selectedDentistId')==null)
    {
      
      this.clinicService.getClinicById(+this.clinicId).subscribe({
        next: (clinic) => {
          this.clinica = clinic;
          
          console.log(clinic);
          
          if (this.clinica.dentists && this.clinica.dentists.length > 0) {
            this.userId = this.clinica.dentists[0].userId;
  
          }
        },
        error: (error) => console.log('Error al cargar la clinica', error)
      });
    }

    else{
      this.userId = parseInt(localStorage.getItem('SelecterUserId') || '', 10);
    }
  
    this.dentistService.getUserbyID(this.userId).subscribe({
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
        
        if(localStorage.getItem('selectedDentistId')!=null)
        {
                  // Obtener posts
        this.postService.getPostByDentistId(parseInt(localStorage.getItem('selectedDentistId') || '', 10)).subscribe({
          next: (posts) => {
            this.post = posts;
  
            // Procesar las imágenes de los posts
            this.post.forEach((post: any) => {
              if (post.image) {
                this.loadUserImage(post.image).then((url) => {
                  post.processedImage = url; // Asigna la imagen procesada
                }).catch(() => {
                  post.processedImage = 'https://via.placeholder.com/150'; // Imagen por defecto si falla
                });
              } else {
                post.processedImage = 'https://via.placeholder.com/150'; // Imagen por defecto si no hay imagen
              }
            });
          },
          error: (error) => {
            this.showSnackBar(error?.error?.value);
          },
        });
        }
      },
      error: (error) => console.log('Error al cargar el dentista', error),
    });
    
  }
  loadPublicationImage(filename: string): void {
    this.dentistService.viewImagePublication(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePublicationview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('Image publication URL:', this.imagePublicationview);
      },
      error: (error) => {
        console.error('Error al cargar la imagen del usuario', error);
        this.showSnackBar('Error al cargar la imagen del usuario');
      }
    });
  }
  loadPublications(){
    this.dentistService.myPublications().subscribe({
      next: (publications) => {
        this.post = publications;
        for(let publication of this.post){
          if(publication.image!= null){
            this.loadPublicationImage(publication.image);
          }
        }
        console.log("Publicaciones: ",publications);
      },
      error: (error) => {
        console.error('Error al cargar las publicaciones', error);
      }
    })
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }


  Volver():void
  {
    if(+this.clinicId===1)
      {
        this.router.navigate(['patient/cita/dentistas']);
        localStorage.removeItem('selectedDentistId');
      }
    else
    {
      this.router.navigate(['patient/cita']);
      localStorage.removeItem('selectedDentistId');
    }
  }
  IrCreateCita(dentistId: number,clinicId:number):void
  { 
    localStorage.setItem('selectedClinicId', clinicId.toString());
    localStorage.setItem('selectedDentistId', dentistId.toString());
    this.router.navigate(['patient/cita/dentistas/dentista/detallesCita'])
  }

  }
 