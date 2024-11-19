import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthResponse } from '../../../shared/models/auth/auth-response-model';
import { profileResponse } from '../../../shared/models/user/user-profile-model';
import { PostService } from '../../../core/services/posts-j/posts-service';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { PublicationResponse } from '../../../shared/models/publication/publication-response.model';
import { PostResponse } from '../../../shared/models/post/post.response.model';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  profileResponse!:profileResponse;
  post : PostResponse[]=[];
  imagePreview: SafeUrl | null = null;
  imagePublicationview: SafeUrl | null = null;
  imagePublicationPreview: SafeUrl | null = null;
  clinica!: ClinicaResponse;
  publicationForm: FormGroup;
  publicationResponse!: PublicationResponse[];

  private clinicService= inject(ClinicService);
  private postService = inject(PostService);
  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private dentistService: DentistService,
    private authService: AuthService) { 
      this.publicationForm = this.fb.group({
        image: ['', Validators.required],
        description: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    
    const userData = this.authService.getUser();
    if (userData && userData.id) {

      this.loadDentistProfile(userData.id);
      this.loadPublications();
    } else {
      console.error('No se pudo obtener el ID del usuario autenticado');
    }
    
  }

  private loadDentistProfile(id: number) {
    
    this.authService.getProfile(id).subscribe({
      next: (profile: profileResponse) => { 
        if (profile.gender?.toLowerCase() === 'm' || profile.gender?.toLowerCase() === 'male') {
          profile.gender = 'Masculino';
        } else if (profile.gender?.toLowerCase() === 'f' || profile.gender?.toLowerCase() === 'female') {
          profile.gender = 'Femenino';
        }
        this.profileResponse = profile;
        console.log("Perfil",profile);
        if (profile.image != null) {
          console.log("si tienes imagen mafren")
          this.loadUserImageDentist(profile.image);

        }
        this.clinicService.getClinicByDentisId( this.profileResponse.idDentista).subscribe({
          next: (clinic) => {
            this.clinica = clinic;
            console.log(clinic);
            this.postService.getPostByDentistId(this.profileResponse.idDentista).subscribe({
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
          },
          error: (error) => console.log('Error al cargar la clinica', error)
        });
        
       
      },
      error: (error: any) => {
        console.error('Error fetching dentist profile', error);
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
  

  loadUserImageDentist(filename: string): void {
    this.dentistService.viewPhoto(filename).subscribe({
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

  loadPublications(){
    this.postService.getPostByDentistId(this.profileResponse.idDentista).subscribe({
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


  onFileSelected(event: any): void {
   const file: File = event.target.files[0];
    if (file) {
     const reader = new FileReader();
    reader.onload = (e: any) => {
    this.imagePublicationPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        this.publicationForm.patchValue({
           image: file
         });
       };
       reader.readAsDataURL(file);
     }
  }

  onSubmitPublication(): void {
    if (this.publicationForm.invalid || !this.imagePublicationPreview) {
     this.showSnackBar('Por favor, complete todos los campos y seleccione una imagen.');
    return;
    }

    
  const userData = this.publicationForm.value;
  this.dentistService.createPublication(userData).subscribe({
      next: () => {
         this.showSnackBar('Publicación creada con éxito');
         this.loadPublications();
       },
       error: (error) => {
      console.error('Error creating publication', error);
       this.showSnackBar('Error al crear la publicación');
       }
     });

  }

  navigateUpdateProfile(){
    console.log('Condition: ', this.profileResponse.condition);
    if(this.profileResponse.condition === 'Estudiante'){
      this.router.navigate(['/dentist/profile/estudiante/update']);
    }else{
      this.router.navigate(['/dentist/profile/profesional/update']);
    }
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }
}