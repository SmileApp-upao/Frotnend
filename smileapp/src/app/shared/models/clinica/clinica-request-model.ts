export interface ClinicRequest {
    openHour: string; 
    name: string;
    closeHour: string;
    openDays: string[];
    address: string;
    desc: string;
    telf: string;
    email: string;
    latitude?: string; 
    longitude?: string; 
}