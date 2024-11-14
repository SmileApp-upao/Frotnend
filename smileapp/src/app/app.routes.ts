import { Routes } from '@angular/router'; 
import { authGuard } from './core/guards/auth/auth.guard';
import { authInverseGuard } from './core/guards/auth/auth-inverse.guard';

export const routes: Routes = [
    {
        path:'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(a => a.authRoutes),
    canActivate:[authInverseGuard]
    }, 

    { 
        path: 'dentist',
        loadChildren: () => import('././pages/dentist/dentist.routes').then(m => m.dentistRoutes)
    },

    { path: 'patient', 
        loadChildren : () => import ("././pages/patient/patient.routes").then(p => p.patientantRoutes),
        canActivate:[authGuard]
    }, 
    
   
    {path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
