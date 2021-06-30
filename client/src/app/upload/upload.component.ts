import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { UploadService } from './upload.service';
import { Anexo } from './anexo';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-anexos',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Input() type: string;
  @Input() idParent: string;
  anexos: Anexo[] = [];

  constructor(
    public dialog: MatDialog,
    public uploadService: UploadService,
    private router: Router
  ) { }

  public openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, { data: { type: this.type, idParent: this.idParent }, width: '50%', height: '32%' });
  }

  ngOnInit(): void {
    if (this.type === 'empresa') {
      this.uploadService.getByEmpresa(this.idParent).subscribe((data: Anexo[]) => {
        this.anexos = data;
      });
    }
    if (this.type === 'conta') {
      this.uploadService.getByConta(this.idParent).subscribe((data: Anexo[]) => {
        this.anexos = data;
      });
    }
    if (this.type === 'pagamento') {
      this.uploadService.getByPagamento(this.idParent).subscribe((data: Anexo[]) => {
        this.anexos = data;
      });
    }
  }

  public async readFile(id): Promise<void> {
    const blob = await this.uploadService.downloadFile(id);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  deleteFile(id): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      mensagem1: 'Deseja mesmo apagar este anexo?',
      botaoSim: true,
      botaoNao: true,
      botaoVoltar: false
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sim') {
        this.uploadService.delete(id).subscribe(
          res => {
            console.log('Excluido');
            this.reloadCurrentRoute();
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
