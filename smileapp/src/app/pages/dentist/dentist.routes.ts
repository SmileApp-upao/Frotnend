import { Routes } from '@angular/router';
import { DentistLayoutComponent } from './dentist-layout/dentist-layout.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component'; 
import { UpaoInfoComponent } from './upao-info/upao-info.component'; 
import { CalendarComponent } from './calendar/calendar.component'; 
import { RepositoryComponent } from './repository/repository.component';
import { UpdateDentistProfComponent } from './update-dentist-prof/update-dentist-prof.component';
import { UpdateDentistEstuComponent } from './update-dentist-estu/update-dentist-estu.component';

export const dentistRoutes: Routes = [
    {
        path: "",
        component: DentistLayoutComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: "profile", component: DentistProfileComponent },
            { path: "add-clinic", component: AddClinicComponent },
            { path: "upao-info", component: UpaoInfoComponent }, 
            { path: "calendar", component: CalendarComponent},
            { path: "repository", component: RepositoryComponent },
            { path: "profile/estudiante/update", component: UpdateDentistEstuComponent },
            { path: "profile/profesional/update", component: UpdateDentistProfComponent } 
        ]
    }
];