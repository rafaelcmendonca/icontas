import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagamento } from '../pagamento';
import { PagamentoService } from '../pagamento.service';
import { Conta } from '../../conta/conta';
import { ContaService } from '../../conta/conta.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-create-pagamento',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreatePagamentoComponent implements OnInit {
  pagamentoForm: FormGroup;
  idConta: string;
  model = new Pagamento();
  valorString;
  contaDescricao: string;
  parentId: string;

  constructor(
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private route: ActivatedRoute,
    public pagamentoService: PagamentoService,
    public contaService: ContaService
  ) {}

  getContaDescricao(id): void {
    this.contaService.getById(id).subscribe((data: Conta) => {
      this.contaDescricao = data.descricao;
    });
  }

  ngOnInit(): void {
    this.pagamentoForm = new FormGroup({
      descricao: new FormControl(this.model.descricao, [
        // Not required
      ]),
      valor: new FormControl(this.model.valor, [
        Validators.required
      ]),
      dataVencimento: new FormControl(this.model.dataVencimento, [
        Validators.required
      ])
    });

    this.route.params.subscribe(params => {
      if ((!params.contaId) && (!params.parentId)) {
        this.router.navigateByUrl('/conta');
        alert('Acesso não autorizado');
      } else {
        this.model.conta = params.contaId;
        this.parentId = params.parentId;
        this.getContaDescricao(this.model.conta);
      }
    });
  }

  submitForm(): void {
    if ((this.model.conta) && (this.parentId)) {
      this.pagamentoService.create(this.model).subscribe(res => {
        this.router.navigateByUrl('/conta/edit/' + this.parentId);
      });
    }
  }

  voltar(): void {
    if (this.parentId) {
      this.router.navigateByUrl('/conta/edit/' + this.parentId);
    }
  }

  transformValor(element): void{
    if (Number(this.valorString)){
      this.model.valor = Number(this.valorString);
      this.valorString = this.currencyPipe.transform(this.valorString, 'R$ ');
    } else {
      this.valorString = '';
    }
    element.target.value = this.model.valor;
  }

  get valor(): any { return this.pagamentoForm.get('valor'); }

  get dataVencimento(): any { return this.pagamentoForm.get('dataVencimento'); }

  get descricao(): any { return this.pagamentoForm.get('descricao'); }
}
