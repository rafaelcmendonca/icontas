import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  mensagem1: string;
  mensagem2: string;
  botaoSim: boolean;
  botaoNao: boolean;
  botaoVoltar: boolean;
  result: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.mensagem1 = data.mensagem1;
    this.mensagem2 = data.mensagem2;
    this.botaoSim = data.botaoSim;
    this.botaoNao = data.botaoNao;
    this.botaoVoltar = data.botaoVoltar;
  }

  public confirmMessage: string;

  ngOnInit(): void {

  }

}
