import { Routes } from '@angular/router';
import { EditClinicComponent } from './pages/dentist/edit-clinic/edit-clinic.component';
import { AddClinicComponent } from './pages/dentist/add-clinic/add-clinic.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { authInverseGuard } from './core/guards/auth/auth-inverse.guard';

export const routes: Routes = [
    {
        path:'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(a => a.authRoutes),
    canActivate:[authInverseGuard]
    },

    { path: 'consultorio/editar', component: EditClinicComponent },

    { path: 'patient', 
        loadChildren : () => import ("././pages/patient/patient.routes").then(p => p.patientantRoutes),
        canActivate:[authGuard]
    },

    { path: 'consultorio/add', component: AddClinicComponent },
    
   
    {path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
