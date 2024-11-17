import { Routes } from '@angular/router';
import { DentistLayoutComponent } from './dentist-layout/dentist-layout.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component'; 
import { UpaoInfoComponent } from './upao-info/upao-info.component';
import { RepositoryComponent } from './repository/repository.component';
import { UpdateDentistProfComponent } from './update-dentist-prof/update-dentist-prof.component';
import { UpdateDentistEstuComponent } from './update-dentist-estu/update-dentist-estu.component';
import { ClinicDetailComponent } from './clinic-detail/clinic-detail.component';
import { UpdateClinicComponent } from './update-clinic/update-clinic.component';


export const dentistRoutes: Routes = [
    {
        path: "",
        component: DentistLayoutComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: "profile", component: DentistProfileComponent },
            { path: "add-clinic", component: AddClinicComponent },
            { path: "clinicDetail", component: ClinicDetailComponent},
            { path: "clinicDetail/update", component: UpdateClinicComponent  },
            { path: "upao-info", component: UpaoInfoComponent },
            { path: "repository", component: RepositoryComponent },
            { path: "profile/estudiante/update", component: UpdateDentistEstuComponent },
            { path: "profile/profesional/update", component: UpdateDentistProfComponent }
        ]
    }
];