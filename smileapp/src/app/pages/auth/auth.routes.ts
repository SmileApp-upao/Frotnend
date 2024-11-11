import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './registerPatient/register-patient.component';
import { TipoCuentaComponent } from './tipo-cuenta/tipo-cuenta.component';
import { TypeDentistComponent } from './type-dentist/type-dentist.component';
import { RegisterProfesionalDentistComponent } from './register-profesional-dentist/register-profesional-dentist.component';
import { RegisterEstudentDentistComponent } from './register-estudent-dentist/register-estudent-dentist.component';

export const authRoutes: Routes = [
    
    {
        path : "",
        component :AuthLayoutComponent,
        children: [
            {path: "login" , component :LoginComponent},
            {path: "type-acount",component: TipoCuentaComponent },
            {path: "type-acount/register-patient" , component : RegisterComponent},
            {path: "type-acount/type-dentist" , component : TypeDentistComponent},
            {path: "type-acount/type-dentist/register-profesional-dentist" , component : RegisterProfesionalDentistComponent},
            {path: "type-acount/type-dentist/register-estudent-dentist" , component : RegisterEstudentDentistComponent},

        ]
    }

];
