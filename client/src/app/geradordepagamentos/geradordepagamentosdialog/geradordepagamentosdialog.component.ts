import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogData, BodyGerador } from '../geradordepagamentos.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { GeradordepagamentosService } from '../geradordepagamentos.service';

@Component({
  selector: 'app-gerador-de-pagamentos-dialog',
  templateUrl: './geradordepagamentosdialog.component.html',
  styleUrls: ['./geradordepagamentosdialog.component.css']
})
export class GeradordepagamentosdialogComponent implements OnInit {
  formulario: FormGroup;
  valorString: string;
  model = new BodyGerador();

  constructor(
    private geradorDePagamentoService: GeradordepagamentosService,
    private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<GeradordepagamentosdialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.model.conta = this.data.idParent;
    this.formulario = new FormGroup({
      quantidade: new FormControl(this.model.quantidade, [
        Validators.required
      ]),
      valor: new FormControl(this.model.valor, [
        Validators.required
      ]),
      vencimento: new FormControl(this.model.vencimento, [
        Validators.required
      ])
    });
  }

  fechar(): void {
    this.reloadCurrentRoute();
    return this.dialogRef.close();
  }

  executar(): void {
    if (!this.formulario.invalid) {
      this.geradorDePagamentoService.gerarPagamentos(this.model).subscribe(res => {
        this.reloadCurrentRoute();
        return this.dialogRef.close();
      });
    }
  }

  transformValor(element): void {
    if (Number(this.valorString)){
      this.model.valor = Number(this.valorString);
      this.valorString = this.currencyPipe.transform(this.valorString, 'R$ ');
    } else {
      this.valorString = '';
    }
    element.target.value = this.model.valor;
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  get quantidade(): any { return this.formulario.get('quantidade'); }
  get valor(): any { return this.formulario.get('valor'); }
  get vencimento(): any { return this.formulario.get('vencimento'); }
}
