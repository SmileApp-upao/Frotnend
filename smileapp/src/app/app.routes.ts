import { Routes } from '@angular/router';

export const routes: Routes = [
    
    {
        path:'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(a => a.authRoutes)
    },
    {path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
