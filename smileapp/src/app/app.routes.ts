import { Routes } from '@angular/router';
import { EditClinicComponent } from './pages/dentist/edit-clinic/edit-clinic.component';
import { AddClinicComponent } from './pages/dentist/add-clinic/add-clinic.component';

export const routes: Routes = [
    { path: 'consultorio/editar', component: EditClinicComponent },
    { path: 'consultorio/add', component: AddClinicComponent }
];
