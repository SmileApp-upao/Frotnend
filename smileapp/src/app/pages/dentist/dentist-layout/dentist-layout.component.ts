import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dentist-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dentist-layout.component.html',
  styleUrls: ['./dentist-layout.component.scss']
})
export class DentistLayoutComponent {
  private router = inject(Router);

  isActive(route: string): boolean {
    return this.router.isActive('/dentist/' + route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
