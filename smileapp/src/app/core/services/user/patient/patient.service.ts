import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PatientResponse } from '../../../../shared/models/user/patient/patient-response-model';
import { HistoriaClinicalRequest } from '../../../../shared/models/user/patient/history-clinical-request-model';
import { HistoriaClinicalResponse } from '../../../../shared/models/user/patient/history-clinical-response.model';
import { EmergencyInfoRequest } from '../../../../shared/models/user/patient/emercency-request.model';
import { EmergencyInfoResponse } from '../../../../shared/models/user/patient/emergency-response.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseURL = `${environment.baseURL}/user/profile`;
  private http = inject(HttpClient);
  private emergencyInfoUpdated = new Subject<void>();
  private clinicalHistoryUpdated = new Subject<void>();
  emergencyInfoUpdated$ = this.emergencyInfoUpdated.asObservable();
  clinicalHistoryUpdated$ = this.clinicalHistoryUpdated.asObservable();

  notifyEmergencyInfoUpdated() {
    this.emergencyInfoUpdated.next();
  }

  notifyClinicalHistoryUpdated() {
    this.clinicalHistoryUpdated.next();
  }

  constructor() { }

  getUserbyID(userID:number):Observable<PatientResponse>{
    return this.http.get<PatientResponse>(`${this.baseURL}/${userID}`)
  }
  updatePatientProfile(userID:number,data: PatientResponse): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.baseURL}/${userID}`, data).pipe(
      tap(() => this.notifyEmergencyInfoUpdated()));
  }
  
  createHistoryClinical(data: HistoriaClinicalRequest): Observable<HistoriaClinicalResponse> {
    return this.http.post<HistoriaClinicalResponse>(`${this.baseURL}/add/History`, data).pipe(
      tap(() => this.notifyClinicalHistoryUpdated()) // Notificar al crear
    );
  }
  updateHistoryClinical(data: HistoriaClinicalRequest): Observable<HistoriaClinicalResponse> {
    return this.http.put<HistoriaClinicalResponse>(`${this.baseURL}/update/History`, data).pipe(
      tap(() => this.notifyClinicalHistoryUpdated()) // Notificar al actualizar
    );
  }

  getHistoryClinical():Observable<HistoriaClinicalResponse>
  {
    return this.http.get<HistoriaClinicalResponse>(`${this.baseURL}/History`);
  }
  createEmergencyInfo(data:EmergencyInfoRequest):Observable<EmergencyInfoResponse>
  {
    return this.http.post<EmergencyInfoResponse>(`${this.baseURL}/add/emergencyInfo`,data).pipe(
      tap(() => this.notifyEmergencyInfoUpdated()) // Notificar al crear
    );
  }

  getEmercenCyInfo():Observable<EmergencyInfoResponse>
  {
    return this.http.get<EmergencyInfoResponse>(`${this.baseURL}/emergencyInfo`);
  }

}
