import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RepositoryService } from '../../../core/services/repository/repository.service';
import { DocFileResponse } from '../../../shared/models/repository/doc-file-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocFileRequest } from '../../../shared/models/repository/doc-file-request.model';
import { NumberInput } from '@angular/cdk/coercion';


@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent {
  docForm!: FormGroup;
  selectedFile: File | null = null;
  fileTouched: boolean = false;
  docToDeleteId: number | null = null;
  docResponse: DocFileResponse[]=[];
  editedDoc: DocFileRequest = { name: '', description: '', docpath: '' };
  selectedDocId: number | null = null; 
  isModalOpen: boolean = false;  

  private snackbar = inject(MatSnackBar);
  private repoService= inject(RepositoryService);
  @ViewChild('confirmationModal') confirmationModal: ElementRef | undefined;
  constructor(private fb: FormBuilder, private repositoryService: RepositoryService) {
    this.docForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });
  }

  setSelectedDoc(docId: number) {
    this.selectedDocId = docId;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    this.fileTouched = true;
  }


  ngOnInit(): void {
    this.repoService.getAllDocs().subscribe(
      {
        next:(docs)=>
        {
          this.docResponse=docs;
          console.log(docs);
        }
        ,
        error:(error)=>{
          const errorMessage = error?.error?.error;
          this.showSnackBar(errorMessage)
          console.log(errorMessage);
        }
      }
    );
    
  }

downloadFile(filename: string): void {
  this.repositoryService.downloadDoc(filename).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }, (error) => {
    console.error('Error al descargar el archivo', error);
  });
}
  onSubmit(): void {
    if (this.docForm.invalid || !this.selectedFile) {
      return;
    }

    // Subir archivo primero
    this.repositoryService.uploadCover(this.selectedFile).subscribe({
      next: (response) => {
        const docData: DocFileRequest = {
          name: this.docForm.value.name,
          description: this.docForm.value.description,
          docpath: response.path, // La ruta del archivo del backend
        };

        // Crear documento
        this.repositoryService.addDoc(docData).subscribe({
          next: (res) => {
            this.showSnackBar('Documento agregado correctamente.');
            this.resetForm();
            this.repoService.getAllDocs().subscribe(
              {
                next:(docs)=>
                {
                  this.docResponse=docs;
                  console.log(docs);
                }
                ,
                error:(error)=>{
                  const errorMessage = error?.error?.error;
                  this.showSnackBar(errorMessage)
                  console.log(errorMessage);
                }
              }
            );

          },
          error: (err) => {
            console.error(err);
            this.showSnackBar('Error al agregar el documento.');
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.showSnackBar("Error al subir el archivo.")
      },
    });
  }
 
  // Método para eliminar el documento después de la confirmación

deleteFile() {
  if (this.selectedDocId !== null) {
    this.repoService.deleteDoc(this.selectedDocId).subscribe({
      next: () => {
        this.docResponse = this.docResponse.filter(doc => doc.id !== this.selectedDocId);
        this.selectedDocId = null; // Limpia el ID seleccionado
      },
      error: (err) => {
        console.error('Error al eliminar el documento:', err);
      }
    });
  }
}

  resetForm(): void {
    this.docForm.reset();
    this.selectedFile = null;
    this.fileTouched = false;
  }

  private showSnackBar(message:string) : void{
    this.snackbar.open(message,'Close',{
      duration : 2000,
      verticalPosition : 'top'
    });
  }

  openModal(docId: number) {
    const doc = this.docResponse.find(d => d.id === docId);
    if (doc) {
      this.selectedDocId = docId;
      this.editedDoc = { 
        name: doc.name, 
        description: doc.description, 
        docpath: doc.docpath // Asignar docpath también
      };
      this.isModalOpen = true;  // Abrir el modal
    }
  }
  closeModal() {
    this.isModalOpen = false;  // Cerrar el modal
  }
  
  onSubmitEdit() {
    if (this.selectedDocId !== null) {
      this.repoService.updateDoc(this.selectedDocId, this.editedDoc).subscribe({
        next: (updatedDoc) => {
          const index = this.docResponse.findIndex(doc => doc.id === this.selectedDocId);
          if (index !== -1) {
            this.docResponse[index] = updatedDoc;
          }
          this.selectedDocId = null; // Limpia el ID seleccionado
        },
        error: (err) => {
          console.error('Error al editar el documento:', err);
        }
      });
    }
  }
}
