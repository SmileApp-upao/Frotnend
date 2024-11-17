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
import { profileResponse } from "../../../shared/models/user/user-profile-model";

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
        const formData = new FormData();
        Object.keys(registerPatientRequest).forEach(key => {
            formData.append(key, registerPatientRequest[key as keyof RegisterPatientRequest].toString());
        });
        return this.http.post<RegisterPatientResponse>(`${this.baseUrl}/register/patient`, formData);
    }

    registerEstudentDentist(registerEstudentRequest: RegisterEstudentRequest): Observable<RegisterEstudentResponse> {
        const formData = new FormData();
        Object.keys(registerEstudentRequest).forEach(key => {
            formData.append(key, registerEstudentRequest[key as keyof RegisterEstudentRequest].toString());
        });
        return this.http.post<RegisterEstudentResponse>(`${this.baseUrl}/register/dentist`, formData);
    }
    
    registerDentist(registerDentistRequest: RegisterDentistRequest): Observable<RegisterDentistResponse> {
        const formData = new FormData();
        Object.keys(registerDentistRequest).forEach(key => {
            formData.append(key, registerDentistRequest[key as keyof RegisterDentistRequest].toString());
        });
        return this.http.post<RegisterDentistResponse>(`${this.baseUrl}/register/dentist`, formData);
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
    getProfile(userId:number): Observable<profileResponse> {
        return this.http.get<profileResponse>(`${environment.baseURL}/user/profile/${userId}`);
    } 
}