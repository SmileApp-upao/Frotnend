import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ClinicaResponse } from '../../../shared/models/clinica/clinica-response-model';
import { ClinicRequestDTO } from '../../../shared/models/clinica/clinica-request-model';
import { PostResponse } from '../../../shared/models/post/post.response.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseURL = `${environment.baseURL}/publications`;
  private http = inject(HttpClient);
  constructor() { }

  getPostByDentistId(dentistId: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseURL}/dentist/${dentistId}`)
  }

}
