import { DentistResponse } from "../user/dentist/dentist-response-model";

export interface ClinicaResponse{
    id: number;
    name: string;
    openDays: string[]; //("MONDAY", "WEDNESDAY").
    openHour: string; 
    closeHour: string;
    address: string;
    desc: string;
    telf: string;
    email: string;
    latitude: string;
    longitude: string;
    dentists: DentistResponse[];
}