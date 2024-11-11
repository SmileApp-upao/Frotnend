import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-clinic',
  standalone: true,
  imports: [],
  templateUrl: './edit-clinic.component.html',
  styleUrl: './edit-clinic.component.scss'
})
export class EditClinicComponent {
  constructor(private router: Router) {}

  navigateToEdit() {
    this.router.navigate(['/consultorio/add']);
  }
}
