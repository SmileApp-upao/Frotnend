import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { ClinicRequest } from '../../../shared/models/clinica/clinica-request-model';
@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private baseURL = `${environment.baseURL}/clinic`; //clinic/clinics
  private http = inject(HttpClient);
  constructor() { }

  getAllClinics(): Observable<ClinicaResponse[]> {
    return this.http.get<ClinicaResponse[]>(`${this.baseURL}/clinics`)
  }

  getClinicById(clinicId:number):Observable<ClinicaResponse>{
    return this.http.get<ClinicaResponse>(`${this.baseURL}/${clinicId}`)
  }

  addClinic(clinicData: ClinicRequest): Observable<ClinicRequest> {
    return this.http.post<ClinicRequest>(`${this.baseURL}/add`, clinicData);
}

updateClinic(clinicData: ClinicRequest): Observable<ClinicaResponse> {
  // Convertir `openDays` a una cadena separada por comas si es un array
  if (Array.isArray(clinicData.openDays)) {
    clinicData.openDays = clinicData.openDays.join(','); // Convertir a cadena separada por comas
  }
  
  return this.http.put<ClinicaResponse>(`${this.baseURL}/update`, clinicData);
}
}
