import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PatientResponse } from '../../../../shared/models/user/patient/patient-response-model';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseURL = `${environment.baseURL}/user/profile`;
  private http = inject(HttpClient);
  constructor() { }

  getUserbyID(userID:number):Observable<PatientResponse>{
    return this.http.get<PatientResponse>(`${this.baseURL}/${userID}`)
  }
}
