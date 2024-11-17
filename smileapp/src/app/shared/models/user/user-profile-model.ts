export interface profileResponse {
    id: number;
    idDentista: number;
    idPaciente: number;
    email: string;                             
    name: string;                
    lastname: string;            
    gender: string;              
    birthday: string;            
    dni: string;                 
    phone: string;         
    cicle?: number;              
    condition?: string;          
    studyCenter?: string;       
    description?: string;   
    image: string;
    parent: string;
    pname: string;
    pdir: string;
    pphone: string;
}