import { DentistResponse } from "../user/dentist/dentist-response-model";

export interface DocFileResponse{

     id:number;
     name:string;
     description:string;
     docpath:string;
     dateUpload:string;
    dentistProfile:DentistResponse;
}