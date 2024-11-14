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

  addClinic(clinicData: ClinicRequestDTO, token: string): Observable<ClinicRequestDTO> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ClinicRequestDTO>(this.baseURL, clinicData, { headers });
  }

  updateClinic(clinicData: ClinicRequestDTO): Observable<ClinicaResponse> {
    // Convertir `openDays` a una cadena separada por comas si es un array
    if (Array.isArray(clinicData.openDays)) {
      clinicData.openDays = clinicData.openDays.join(','); // Convertir a cadena separada por comas
    }
    return this.http.put<ClinicaResponse>(`${this.baseURL}/update`, clinicData);
  }
}
