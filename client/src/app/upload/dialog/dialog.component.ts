import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService, DialogData } from '../upload.service';
import { forkJoin } from 'rxjs';
import { Anexo } from '../anexo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @ViewChild('file', { static: false }) fileInput;
  anexoForm: FormGroup;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Anexar';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  public file: File;
  public model = new Anexo();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.updateId();
    this.anexoForm = new FormGroup({
      descricao: new FormControl(this.model.descricao, [
        Validators.required
      ])
    });
   }

  onFilesAdded(): void {
    const originalFile = this.fileInput.nativeElement.files[0];
    const originalName: string = this.fileInput.nativeElement.files[0].name;
    const newName = originalName.replace(/[^a-zA-Z0-9.-]/g, "");
    this.file = new File([originalFile], newName, {type: originalFile.type, lastModified: originalFile.lastModified});
  }

  get fileName(): any {
    if (this.file){
      return this.file.name;
    }
    return '';
  }

  addFiles(): void {
    this.fileInput.nativeElement.click();
  }

  updateId(): void {
    if (this.data.type === 'empresa') {
      this.model.empresa = this.data.idParent;
    }
    if (this.data.type === 'conta') {
      this.model.conta = this.data.idParent;
    }
    if (this.data.type === 'pagamento') {
      this.model.pagamento = this.data.idParent;
    }
  }

  closeDialog(): void {
    if (this.uploadSuccessful) {
      this.reloadCurrentRoute();
      return this.dialogRef.close();
    }
    this.uploading = true;
    this.model.file = this.file;
    this.progress = this.uploadService.upload(this.model);
    this.primaryButtonText = 'Pronto!';
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;
    // When all progress-observables are completed...
    forkJoin(this.progress).subscribe(end => {
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  get descricao(): any { return this.anexoForm.get('descricao'); }
}
