import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../storage.service";
import { AuthRequest } from "../../../shared/models/auth/auth-request-model";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../../shared/models/auth/auth-response-model";
import { RegisterPatientResponse } from "../../../shared/models/auth/register-patient-response.model";
import { RegisterPatientRequest } from "../../../shared/models/auth/register-patient-request.model";

@Injectable({
  providedIn: "root"
})

export class AuthService {
    
    private baseUrl = `${environment.baseUrl}/auth`;
    private http = inject(HttpClient);
    private storageService = inject(StorageService);

    constructor() {}

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest)
        .pipe(
            tap(Response => this.storageService.setAuthData(Response))
        );
    }
    
    register(registerRequest: RegisterPatientRequest): Observable<RegisterPatientResponse> {
        return this.http.post<RegisterPatientResponse>(`${this.baseUrl}/register/patient`, registerRequest);
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
}