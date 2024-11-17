import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  addClinic(clinicData: ClinicRequestDTO): Observable<ClinicaResponse> {
    const formData = new FormData();
    
    Object.entries(clinicData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value, value.name);
      } else if (Array.isArray(value)) {
        formData.append(key, value.join(','));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    return this.http.post<ClinicaResponse>(`${this.baseURL}/add`, formData);
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

  updatePhoto(id: number, image: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.put(`${this.baseURL}/${id}/image`, formData, {
      observe:'response',
      responseType: 'text'
    });
  }

  viewPhoto(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseURL}/uploads/${filename}`, { responseType: 'blob' });
  }

  
}

