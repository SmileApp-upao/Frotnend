import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  isStudent: boolean = false;
  isAuthenticated: boolean = false;

  isActive(route: string): boolean {
    return this.router.isActive('/dentist/' + route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(profile => {
      this.isStudent = profile.condition === 'Estudiante'; 
      this.isAuthenticated = true; 
    });
  }

  logout():void{
    this.authService.logout();
    this.isAuthenticated=false;
    this.router.navigate(['/auth/login']);
  }
}
