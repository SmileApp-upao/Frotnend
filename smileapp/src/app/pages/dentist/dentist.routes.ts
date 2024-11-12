import { Routes } from '@angular/router';
import { DentistLayoutComponent } from './dentist-layout/dentist-layout.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component';
import { EditClinicComponent } from './edit-clinic/edit-clinic.component';

export const dentistRoutes: Routes = [
    {
        path: "",
        component: DentistLayoutComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: "profile", component: DentistProfileComponent },
            { path: "edit-clinic", component: EditClinicComponent },
            { path: "add-clinic", component: AddClinicComponent }
        ]
    }
];