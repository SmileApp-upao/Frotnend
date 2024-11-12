import { Routes } from '@angular/router'; 

export const routes: Routes = [

    { 
        path: 'dentist',
        loadChildren: () => import('././pages/dentist/dentist.routes').then(m => m.dentistRoutes)
    },
    { path: 'patient', 
        loadChildren : () => import ("././pages/patient/patient.routes").then(p => p.patientantRoutes)
    },
    {
        path:'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(a => a.authRoutes)
    },
    {path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
