export interface PatientResponse{
    id: number;
    userId:number;
    email:string;
    gender: string;
    phone: string;
    name: string;
    lastname: string;
    birthday: string;
    age: number;
    parent:string;
    pname:string;
    pphone:string;
    pdir:string;
    otherRelationship?:string;
}