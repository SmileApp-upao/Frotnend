import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PatientResponse } from '../../../../shared/models/user/patient/patient-response-model';
import { HistoriaClinicalRequest } from '../../../../shared/models/user/patient/history-clinical-request-model';
import { HistoriaClinicalResponse } from '../../../../shared/models/user/patient/history-clinical-response.model';
import { EmergencyInfoRequest } from '../../../../shared/models/user/patient/emercency-request.model';
import { EmergencyInfoResponse } from '../../../../shared/models/user/patient/emergency-response.model';
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
  updateHistoryClinical(data: HistoriaClinicalRequest): Observable<HistoriaClinicalResponse> {
    return this.http.put<HistoriaClinicalResponse>(`${this.baseURL}/update/History`, data);
  }

  getHistoryClinical():Observable<HistoriaClinicalResponse>
  {
    return this.http.get<HistoriaClinicalResponse>(`${this.baseURL}/History`);
  }
  createEmergencyInfo(data:EmergencyInfoRequest):Observable<EmergencyInfoResponse>
  {
    return this.http.post<EmergencyInfoResponse>(`${this.baseURL}/add/emergencyInfo`,data);
  }

  getEmercenCyInfo():Observable<EmergencyInfoResponse>
  {
    return this.http.get<EmergencyInfoResponse>(`${this.baseURL}/emergencyInfo`);
  }

}
