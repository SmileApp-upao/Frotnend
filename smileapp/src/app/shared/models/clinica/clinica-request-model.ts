import { DentistResponse } from "../user/dentist/dentist-response-model";

export interface ClinicRequestDTO {
    name: string;
    openHour: string;
    closeHour: string;
    openDays: string;
    address: string;
    desc: string;
    telf: string;
    email: string;
    latitude?: string;
    longitude?: string;
    dentists: DentistResponse[];
  }