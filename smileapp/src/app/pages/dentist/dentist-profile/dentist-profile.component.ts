import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DentistService } from '../../../core/services/user/dentist/dentist.service';
import { DentistResponse } from '../../../shared/models/user/dentist/dentist-response-model';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  dentistProfile!: DentistResponse;

  constructor(private dentistService: DentistService,
    private authService: AuthService) { }

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData && userData.id) {
      this.loadDentistProfile(userData.id);
    } else {
      console.error('No se pudo obtener el ID del usuario autenticado');
    }
  }

  private loadDentistProfile(id: number) {
    this.dentistService.getUserbyID(id).subscribe({
      next: (profile: DentistResponse) => { 
        if (profile.gender?.toLowerCase() === 'm' || profile.gender?.toLowerCase() === 'male') {
          profile.gender = 'Masculino';
        } else if (profile.gender?.toLowerCase() === 'f' || profile.gender?.toLowerCase() === 'female') {
          profile.gender = 'Femenino';
        }
        this.dentistProfile = profile;
      },
      error: (error: any) => {
        console.error('Error fetching dentist profile', error);
      }
    });
  }
}