import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent {}
