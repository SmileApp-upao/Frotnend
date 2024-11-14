import { Component, inject } from '@angular/core';
import { PatientResponse } from '../../../../models/user/patient/patient-response-model';
import { PatientService } from '../../../../../core/services/user/patient/patient.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmergencyInfoResponse } from '../../../../models/user/patient/emergency-response.model';
import { EmergencyInfoRequest } from '../../../../models/user/patient/emercency-request.model';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent {
  public UserProfile!: PatientResponse;
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private patientService = inject(PatientService)
  private fb = inject(FormBuilder);
  private router=inject(Router)
  profileId:number=0;
  updateUserForm!: FormGroup;
  existEmercency : boolean = false;
  showOtherRelationship = false;

  constructor()
  {
    this.updateUserForm = this.fb.group (
      {
        name: ['',[Validators.required,]],
        lastname :['',[Validators.required,]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['',[Validators.required,]],
        birthday :['',[Validators.required,]],
        phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
        parent:['',[Validators.required,]],
        pname: ['',[Validators.required,]],
        pphone:['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
        pdir:['',[Validators.required,]],
        otherRelationship: [''],
      }
    )
  }

  ngOnInit(): void {

    const authData = this.authService.getUser();
    const userId = authData?.id;
    
    if(userId)
    { this.profileId=userId;
      this.patientService.getUserbyID(userId).subscribe(
        {
          next:(patientProfile)=>
          {
            this.UserProfile=patientProfile;
            this.updateUserForm.patchValue(patientProfile);
          },
          error:(error)=>{
            this.showSnackBar(error.error?.value);
          }
        }
      );

      this.patientService.getEmercenCyInfo().subscribe({
        next:()=>
        {
          this.existEmercency =true;
        },
        error:(error)=>
        {
          console.log(error.error?.value)
        }
      });
  }
  }
  onRelationshipChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showOtherRelationship = selectedValue === 'Otro';

    if (this.showOtherRelationship) {
      this.updateUserForm
        .get('otherRelationship')
        ?.setValidators(Validators.required);
    } else {
      this.updateUserForm.get('otherRelationship')?.clearValidators();
      this.updateUserForm.get('otherRelationship')?.reset();
    }
    this.updateUserForm.get('otherRelationship')?.updateValueAndValidity();
  }
  
  onSubmit(): void {
    if (this.updateUserForm.valid) {
      console.log('Formulario válido y listo para enviar:', this.updateUserForm.value);
  
      const updateInfo: PatientResponse = { ...this.updateUserForm.value };
  
      if (this.updateUserForm.value.parent === 'Otro') {
        updateInfo.parent = this.updateUserForm.value.otherRelationship;
        delete updateInfo.otherRelationship;
      }
  
      console.log("datos a enviar:",updateInfo);
  
      this.patientService.updatePatientProfile(this.profileId,updateInfo).subscribe({
        next: () => {
          this.showSnackBar('Información de emergencia registrada exitosamente.');
          this.existEmercency=true;
          this.router.navigate(['/patient']);
        },
        error: (error) => {
          const errorMessage = error.error['error'] || 'Ese correo ya esta registrado';
          console.log('Error:', errorMessage);
          this.showSnackBar(errorMessage);
        }
      });
    }
    else{
      Object.keys(this.updateUserForm.controls).forEach(field => {
      const control = this.updateUserForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    // Muestra un mensaje indicando que hay errores en el formulario
    this.showSnackBar('Por favor, corrige los errores en el formulario antes de enviar.');
 
    }
    
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }

}
