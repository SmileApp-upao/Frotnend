import { Component, inject } from '@angular/core';
import {RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.scss'
})
export class PatientLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  isAuthenticated: boolean = false;
  isActive(route: string): boolean {
    
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  logout():void{
    this.authService.logout();
    this.isAuthenticated=false;
    this.router.navigate(['/auth/login']);
  }
}
