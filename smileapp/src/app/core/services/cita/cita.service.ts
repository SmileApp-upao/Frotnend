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
    return this.http.get<CitasResponse[]>(`${this.baseURL}/propias`).pipe(
      map((citas) =>
        citas.map((cita) => ({
          title: `${cita.patientName} - ${cita.reason}`, // El título será el nombre del paciente y la razón
          start: `${cita.date}T${cita.hour}`,  // El evento inicia con la fecha y hora
          extendedProps: {
            clinicName: cita.clinicname,
            clinicDescription: cita.clinicdescription,
            patientName: cita.patientName,
            dentistName: cita.dentistName,
            dentistLastName: cita.dentistLastName,
            reason: cita.reason
          }
        }))
      )
    );
  }
}
