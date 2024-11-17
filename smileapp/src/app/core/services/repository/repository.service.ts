import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UploadMediaResponse } from '../../../shared/models/repository/uploadMediaResponse.model';
import { DocFileRequest } from '../../../shared/models/repository/doc-file-request.model';
import { DocFileResponse } from '../../../shared/models/repository/doc-file-response.model';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private baseURL = `${environment.baseURL}/repository`;
  private fileURL = `${environment.baseURL}/publications`;
  private http = inject(HttpClient);
  constructor() { }

  uploadCover(file: File):Observable<UploadMediaResponse>
  {
      const formData = new FormData();
      formData.append('file', file);
      return this.http.post<UploadMediaResponse>(`${this.baseURL}/file/upload`, formData);
  }
  
  getAllDocs(): Observable<DocFileResponse[]> {
    return this.http.get<DocFileResponse[]>(`${this.baseURL}/all`)
  }

  getDocById(docId: number): Observable<DocFileResponse> {
    return this.http.get<DocFileResponse>(`${this.baseURL}/${docId}`)
  }

  addDoc(DocData: DocFileRequest): Observable<DocFileResponse> {
    return this.http.post<DocFileResponse>(`${this.baseURL}/create`, DocData);
  }

  updateDoc(docId: number, data: DocFileRequest): Observable<DocFileResponse> {
    return this.http.put<DocFileResponse>(`${this.baseURL}/update/${docId}`, data);
  }

  deleteDoc(docId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseURL}/delete/${docId}`);
  }

  downloadDoc(filename: string): Observable<Blob> {
    return this.http.get(`${this.fileURL}/file/${filename}`, { responseType: 'blob' });
  }
}
