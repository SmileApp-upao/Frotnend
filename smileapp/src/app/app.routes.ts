import { Routes } from '@angular/router';
import { EditClinicComponent } from './pages/dentist/edit-clinic/edit-clinic.component';
import { AddClinicComponent } from './pages/dentist/add-clinic/add-clinic.component';

export const routes: Routes = [


    { path: 'consultorio/editar', component: EditClinicComponent },
    { path: 'patient', 
        loadChildren : () => import ("././pages/patient/patient.routes").then(p => p.patientantRoutes)
    },
    { path: 'consultorio/add', component: AddClinicComponent },
    {
        path:'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(a => a.authRoutes)
    },
    {path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
