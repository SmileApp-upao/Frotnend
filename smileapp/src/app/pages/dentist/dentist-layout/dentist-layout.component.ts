import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClinicService } from '../../../core/services/clinic/clinic.service';
import { profileResponse } from '../../../shared/models/user/user-profile-model';

@Component({
  selector: 'app-dentist-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dentist-layout.component.html',
  styleUrls: ['./dentist-layout.component.scss']
})
export class DentistLayoutComponent {
  private router = inject(Router); 
  private authService = inject(AuthService);
  private clinicService = inject(ClinicService);
  isStudent: boolean = false;
  isAuthenticated: boolean = false;
  hasClinic: boolean = false;
  profileResponse!: profileResponse;

  isActive(route: string): boolean {
    return this.router.isActive('/dentist/' + route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  ngOnInit(): void {
    const authData = this.authService.getUser();
    const userId = authData?.id;
    if (userId) {

      this.authService.getProfile(userId).subscribe({
        next: (profileResponse) => {
          
          this.isStudent = profileResponse.condition === 'Estudiante';
          this.isAuthenticated = true;
          console.log('idDentista:', profileResponse.idDentista);

          this.clinicService.getClinicByDentisId(profileResponse.idDentista).subscribe({
            next: (clinic) => {

              console.log('Clinica:', clinic);
              this.hasClinic = clinic != null; // Verifica si la clínica no es nula
              console.log('Tiene clínica:', this.hasClinic);
              this.hasClinic = true;
            },

            error: (error) => {
              console.error('Error al cargar la clínica', error);
              this.hasClinic = false;
            }
          });
        }
      });
    }
  }


  clinicDetail(): void {
    if(this.isStudent == true){
      this.router.navigate(['/dentist/upao-info']);
    }
    else{
      if(!this.hasClinic){
        this.router.navigate(['/dentist/add-clinic']);
      }
      else{
        this.router.navigate(['/dentist/clinicDetail']);
      }
    }
  }

  logout():void{
    this.authService.logout();
    this.isAuthenticated=false;
    this.router.navigate(['/auth/login']);
  }
}
