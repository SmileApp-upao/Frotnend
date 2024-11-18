import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DentistResponse } from '../../../../shared/models/user/dentist/dentist-response-model';
import { RegisterEstudentRequest } from '../../../../shared/models/auth/register-student-dentist-request.model';
import { RegisterEstudentResponse } from '../../../../shared/models/auth/register-student-dentist-response.model';
import { RegisterDentistRequest } from '../../../../shared/models/auth/register-dentist-profesional-request.model';
import { RegisterDentistResponse } from '../../../../shared/models/auth/register-dentist-profesional-response.model';
import { PublicationRequest } from '../../../../shared/models/publication/publication-request.model';
import { PublicationResponse } from '../../../../shared/models/publication/publication-response.model';

@Injectable({
  providedIn: 'root'
})
export class DentistService {
  private baseURL = `${environment.baseURL}/user/profile`;
  private baseURL2 = `${environment.baseURL}/publications`;
  private http = inject(HttpClient);
  constructor() { }

  getUserbyID(userID:number):Observable<DentistResponse>{
    return this.http.get<DentistResponse>(`${this.baseURL}/${userID}`)
  }

  
  updateEstudentDentist(dentistId: number, registerEstudentRequest: RegisterEstudentRequest): Observable<RegisterEstudentResponse> {
    return this.http.put<RegisterEstudentResponse>(`${this.baseURL}/${dentistId}`, registerEstudentRequest);
  }

  getEstudentProfile(id: number): Observable<RegisterEstudentResponse> {
    return this.http.get<RegisterEstudentResponse>(`${this.baseURL}/${id}`);
  }

  updateProfesionalDentist(dentistId: number, registerDentistRequest: RegisterDentistRequest): Observable<RegisterDentistResponse> {
    return this.http.put<RegisterDentistResponse>(`${this.baseURL}/${dentistId}`, registerDentistRequest);
  }

  getProfesionalProfile(id: number): Observable<RegisterDentistResponse> {
    return this.http.get<RegisterDentistResponse>(`${this.baseURL}/${id}`);
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

  createPublication(publicationRequest: PublicationRequest): Observable<PublicationResponse> {
    const formData = new FormData();
    formData.append('image', publicationRequest.image);
    formData.append('description', publicationRequest.description);

    return this.http.post<PublicationResponse>(`${this.baseURL2}/create`, formData);
  }

  myPublications(): Observable<PublicationResponse[]> {
    return this.http.get<PublicationResponse[]>(`${this.baseURL2}/dentist`);
  }

  viewImagePublication(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseURL2}/uploads/${filename}`, { responseType: 'blob' });
  }
  
}
