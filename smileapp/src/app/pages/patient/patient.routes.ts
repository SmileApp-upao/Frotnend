import { Routes } from '@angular/router';
import { PatientLayoutComponent } from './patient-layout/patient-layout.component';
import { ProfileComponent } from '../../shared/components/profile/user-profile/profile.component';
import { CitaLayoutComponent } from './cita-mapa-layout/cita-layout.component';
import { ListofdentistComponent } from './List-of-Dentist/List-of-Dentist.component';
import { DentistDetailsComponent } from './dentist-details/dentist-details.component';
import { CitaDetailsComponent } from './cita-details/cita-details.component';
export const patientantRoutes: Routes = [
    {
        path : "",
        component :PatientLayoutComponent,
        children: [
            {path: "" , component :ProfileComponent},
            {path: "cita" , component :CitaLayoutComponent},
            {path: "cita/dentistas" , component :ListofdentistComponent},
            {path: "cita/dentistas/dentista" , component :DentistDetailsComponent},
            {path: "cita/dentistas/dentista/detallesCita" , component :CitaDetailsComponent}
        ]
    }
];