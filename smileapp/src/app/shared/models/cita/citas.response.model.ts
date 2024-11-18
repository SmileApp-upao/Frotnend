export interface CitasResponse{ 
    id:number;
    patientId:number;
    dentistId:number; 
    dentistUserId: 3;
    date: string;  
    hour: string;  
    clinicId:number;
    clinicname:string;
    clinicdescription:string;
    clinicdirection:string;
    filePaths :string[];
    patientName:string;
    reason: string;
    dentistName:string;
    dentistLastName:string;

}