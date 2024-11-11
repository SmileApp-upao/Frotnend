import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [],
  templateUrl: './add-clinic.component.html',
  styleUrl: './add-clinic.component.scss'
})
export class AddClinicComponent {
  constructor(private router: Router) {}

  navigateToEdit() {
    this.router.navigate(['/consultorio/editar']); // Ruta de destino
  }
}
