import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../storage.service";
import { AuthRequest } from "../../../shared/models/auth/auth-request-model";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../../shared/models/auth/auth-response-model";
import { RegisterPatientResponse } from "../../../shared/models/auth/register-patient-response.model";
import { RegisterPatientRequest } from "../../../shared/models/auth/register-patient-request.model";
import { RegisterEstudentRequest } from "../../../shared/models/auth/register-student-dentist-request.model";
import { RegisterEstudentResponse } from "../../../shared/models/auth/register-student-dentist-response.model";
import { RegisterDentistRequest } from "../../../shared/models/auth/register-dentist-profesional-request.model";
import { RegisterDentistResponse } from "../../../shared/models/auth/register-dentist-profesional-response.model"; 
import { Cop } from "../../../shared/models/auth/cop-model";
import { DentistResponse } from "../../../shared/models/user/dentist/dentist-response-model";

@Injectable({
  providedIn: "root"
})

export class AuthService {
    
    private baseUrl = `${environment.baseURL}/auth`;
    private http = inject(HttpClient);
    private storageService = inject(StorageService);

    constructor() {}

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest)
        .pipe(
            tap(Response => this.storageService.setAuthData(Response))
        );
    }
    
    registerPatient(registerPatientRequest: RegisterPatientRequest): Observable<RegisterPatientResponse> {
        return this.http.post<RegisterPatientResponse>(`${this.baseUrl}/register/patient`, registerPatientRequest);
    }

    registerEstudentDentist(registerEstudentRequest: RegisterEstudentRequest): Observable<RegisterEstudentResponse> {
        return this.http.post<RegisterEstudentResponse>(`${this.baseUrl}/register/dentist`, registerEstudentRequest);
    }
    
    registerDentist(registerDentistRequest: RegisterDentistRequest): Observable<RegisterDentistResponse> {
        return this.http.post<RegisterDentistResponse>(`${this.baseUrl}/register/dentist`, registerDentistRequest);
    }
    
    // validarCop(cop: Cop): Observable<string> {
    //     return this.http.post<string>(`${this.baseUrl}/validarCop`, cop);
    // }

    validarCop(cop: string): Observable<string> {
        return this.http.post<string>(`${this.baseUrl}/validarCop`, { cop }, { responseType: 'text' as 'json' });
    }

    logout(): void {
        this.storageService.clearAuthData();
    }

    isAuthenticated(): boolean {
        return this.storageService.getAuthData()!== null;
    }

    getUser(): AuthResponse | null {
        const authData = this.storageService.getAuthData();
        return authData? authData : null;
    }

    getUserProfile(): Observable<DentistResponse> {
        const userId = this.getUser()?.id; 
        return this.http.get<DentistResponse>(`${environment.baseURL}/user/profile/${userId}`);
    } 
}