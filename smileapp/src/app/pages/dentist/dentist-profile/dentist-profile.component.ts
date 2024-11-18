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

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  profileResponse!:profileResponse;
  imagePreview: SafeUrl | null = null;
  imagePublicationview: SafeUrl | null = null;
  imagePublicationPreview: SafeUrl | null = null;
  clinica!: ClinicaResponse;
  publicationForm: FormGroup;
  publicationResponse!: PublicationResponse[];

  private clinicService= inject(ClinicService);
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
    } else {
      console.error('No se pudo obtener el ID del usuario autenticado');
    }
    
    this.loadPublications();

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
          this.loadUserImage(profile.image);
        }
        this.clinicService.getClinicByDentisId( this.profileResponse.idDentista).subscribe({
          next: (clinic) => {
            this.clinica = clinic;
            console.log(clinic);
          },
          error: (error) => console.log('Error al cargar la clinica', error)
        });
        
       
      },
      error: (error: any) => {
        console.error('Error fetching dentist profile', error);
      }
    });
    
  }
  
  loadUserImage(filename: string): void {
    this.dentistService.viewPhoto(filename).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('Image profile URL:', this.imagePreview);
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
        this.publicationResponse = publications;
        for(let publication of this.publicationResponse){
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