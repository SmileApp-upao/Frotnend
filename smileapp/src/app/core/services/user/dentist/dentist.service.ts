import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DentistResponse } from '../../../../shared/models/user/dentist/dentist-response-model';

@Injectable({
  providedIn: 'root'
})
export class DentistService {
  private baseURL = `${environment.baseURL}/user/profile`;
  private http = inject(HttpClient);
  constructor() { }

  getUserbyID(userID:number):Observable<DentistResponse>{
    return this.http.get<DentistResponse>(`${this.baseURL}/${userID}`)
  }
}
