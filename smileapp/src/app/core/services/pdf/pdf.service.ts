import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments.prod';
import { NowTimer } from '@fullcalendar/core/internal';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
 
  private http = inject(HttpClient);

  constructor() {}
 
  downloadPdf(solicitanteId: number, quoteId: number): Observable<Blob> { 
    return this.http.get(`${environment.baseURL}/reports/pdf/${solicitanteId}/${quoteId}`, {
      responseType: 'blob' 
    });
  }
}