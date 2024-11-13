import { Routes } from '@angular/router';
import { DentistLayoutComponent } from './dentist-layout/dentist-layout.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component'; 
import { UpaoInfoComponent } from './upao-info/upao-info.component';

export const dentistRoutes: Routes = [
    {
        path: "",
        component: DentistLayoutComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: "profile", component: DentistProfileComponent },
            { path: "add-clinic", component: AddClinicComponent },
            { path: "upao-info", component: UpaoInfoComponent }
        ]
    }
];