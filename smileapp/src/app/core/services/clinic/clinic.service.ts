import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { ClinicRequestDTO } from '../../../shared/models/clinica/clinica-request-model';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private baseURL = `${environment.baseURL}/clinic`;
  private http = inject(HttpClient);
  constructor() { }

  getAllClinics(): Observable<ClinicaResponse[]> {
    return this.http.get<ClinicaResponse[]>(`${this.baseURL}/clinics`)
  }

  getClinicById(clinicId: number): Observable<ClinicaResponse> {
    return this.http.get<ClinicaResponse>(`${this.baseURL}/${clinicId}`)
  }

  addClinic(clinicData: ClinicRequestDTO): Observable<ClinicRequestDTO> {
    return this.http.post<ClinicRequestDTO>(`${this.baseURL}/add`, clinicData);
  }

  updateClinic(clinicData: ClinicRequestDTO): Observable<ClinicaResponse> {

    if (Array.isArray(clinicData.openDays)) {
      clinicData.openDays = clinicData.openDays.join(',');
    }
    return this.http.put<ClinicaResponse>(`${this.baseURL}/update`, clinicData);
  }
  getClinicByDentisId(dentistId: number):Observable<ClinicaResponse>
  {
    return this.http.get<ClinicaResponse>(`${this.baseURL}/dentist/${dentistId}`)
  }
}
