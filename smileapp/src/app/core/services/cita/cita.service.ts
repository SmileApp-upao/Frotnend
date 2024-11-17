import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { citaModel } from '../../../shared/models/cita/cita.model';
import { CitasResponse } from '../../../shared/models/cita/citas.response.model';
@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseURL = `${environment.baseURL}/citas`; //clinic/clinics
  private http = inject(HttpClient);
  constructor() { }

  createCita(data: citaModel): Observable<any> {
    const formData = new FormData();
  
    // Agregar los datos básicos
    formData.append('dentistId', data.dentistId.toString());
    formData.append('reason', data.reason);
    formData.append('date', data.date);
    formData.append('hour', data.hour);
  
    // Agregar múltiples imágenes
    if (data.images) {
      data.images.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }
  
    return this.http.post<any>(`${this.baseURL}/create`, formData);
  }

  myCitas(): Observable<CitasResponse[]> {
    return this.http.get<CitasResponse[]>(`${this.baseURL}/propias`);
  }
}
