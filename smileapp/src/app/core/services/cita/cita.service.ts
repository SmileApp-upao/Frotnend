import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { citaModel } from '../../../shared/models/cita/cita.model';
import { CitasResponse } from '../../../shared/models/cita/citas.response.model';
@Injectable({
  providedIn: 'root'
})
export class CitaService {
  static calendarCitas(): Observable<unknown> {
      throw new Error('Method not implemented.');
  }
  private baseURL = `${environment.baseURL}/citas`; //clinic/clinics
  private http = inject(HttpClient);
  constructor() { }

  createCita(data: citaModel): Observable<citaModel> {
    return this.http.post<citaModel>(`${this.baseURL}/create`, data);
  }

  myCitas(): Observable<CitasResponse[]> {
    return this.http.get<CitasResponse[]>(`${this.baseURL}/propias`);
  }

  calendarCitas(): Observable<CitasResponse[]> {
    return this.http.get<CitasResponse[]>(`${this.baseURL}/calendar`);
  }
}
