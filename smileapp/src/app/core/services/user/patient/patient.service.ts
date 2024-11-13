import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PatientResponse } from '../../../../shared/models/user/patient/patient-response-model';
import { HistoriaClinicalRequest } from '../../../../shared/models/user/patient/history-clinical-request-model';
import { HistoriaClinicalResponse } from '../../../../shared/models/user/patient/history-clinical-response.model';
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

  createHistoryClinical(data: HistoriaClinicalRequest): Observable<HistoriaClinicalResponse> {
    return this.http.post<HistoriaClinicalResponse>(`${this.baseURL}/add/History`, data);
  }

}
