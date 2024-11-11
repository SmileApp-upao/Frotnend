import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'patient', 
        loadChildren : () => import ("././pages/patient/patient.routes").then(p => p.patientantRoutes)
    },
];
