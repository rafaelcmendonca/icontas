import { Component, Inject, OnInit } from '@angular/core';
import { ContaService } from 'src/app/conta/conta.service';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { PagamentoService } from 'src/app/pagamento/pagamento.service';
import { Categoria } from 'src/app/categoria/categoria';
import { Empresa } from 'src/app/empresa/empresa';
import { Conta } from 'src/app/conta/conta';
import { Pagamento } from 'src/app/pagamento/pagamento';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sumario',
  templateUrl: './sumario.component.html',
  styleUrls: ['./sumario.component.css']
})
export class SumarioComponent implements OnInit {
  categorias: Categoria[] = [];
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentos: Pagamento[] = [];

  // Geral
  totalContas: number;
  totalEmHaver: number;
  totalPago: number;

  // Mes atual
  mesEmHaver: number;
  mesPago: number;
  mesString: string;

  // Proximo mes
  proximoEmHaver: number;

  // Proximos 3 meses
  quarterEmHaver: number;


  constructor(
    public contaService: ContaService,
    public categoriaService: CategoriaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  ngOnInit(): void {
    this.categoriaSelecionada = localStorage.getItem("idCategoriaSumarioDashboard");
    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
            this.atualizaTotal();
          });
        });
      });
    });
  }

  getConta(id): any {
    return this.contas.find(conta => conta._id === id);
  }

  contaBelongToCategoria(id): any {
    if (this.getConta(id).categoria === this.categoriaSelecionada)
      return true
    else
      return false
  }

  atualizaTotal(): void {
    this.totalContas = 0;
    this.totalPago = 0;
    this.totalEmHaver = 0;
    this.mesEmHaver = 0;
    this.proximoEmHaver = 0;
    this.quarterEmHaver = 0;
    this.mesPago = 0;
    if (this.categoriaSelecionada !== "todas") {
      this.pagamentos = this.pagamentos.filter(pagamento => this.contaBelongToCategoria(pagamento.conta));
    }
    this.pagamentos.forEach(pagamento => {
      this.totalContas += pagamento.valor;
      if (pagamento.status){
        this.totalEmHaver += pagamento.valor;
        if (this.isMesAtual(pagamento.dataVencimento)){
          this.mesEmHaver += pagamento.valor;
        }
        if (this.isProximoMes(pagamento.dataVencimento)){
          this.proximoEmHaver += pagamento.valor;
        }
        if (this.isNextQuarter(pagamento.dataVencimento)){
          this.quarterEmHaver += pagamento.valor;
        }
      } else {
        this.totalPago += pagamento.valor;
        if (this.isMesAtual(pagamento.dataPagamento)) {
          this.mesPago += pagamento.valor;
        }
      }
    });
    const date = new Date();
    this.mesString = this.getMonthString(date.getMonth());
  }

  isMesAtual(dataString): boolean {
    const date = new Date(dataString);
    const hoje = new Date();
    if ((date.getFullYear() === hoje.getFullYear()) && (date.getMonth() === hoje.getMonth())) {
      return true;
    } else {
      return false;
    }
  }

  isProximoMes(dataString): boolean {
    const date = new Date(dataString);
    const hoje = new Date();
    hoje.setMonth(hoje.getMonth() + 1);
    if ((date.getFullYear() === hoje.getFullYear()) && (date.getMonth() === hoje.getMonth())) {
      return true;
    } else {
      return false;
    }
  }

  isNextQuarter(dataString): boolean {
    const date = new Date(dataString);
    const hoje = new Date();
    const quarter = new Date();
    quarter.setMonth(quarter.getMonth() + 3);
    if ( (hoje <= date) && (date <= quarter) ) {
      return true;
    } else {
      return false;
    }
  }

  public getMonthString(month): string {
    switch (month) {
      case 0: return 'Janeiro';
      case 1: return 'Fevereiro';
      case 2: return 'Março';
      case 3: return 'Abril';
      case 4: return 'Maio';
      case 5: return 'Junho';
      case 6: return 'Julho';
      case 7: return 'Agosto';
      case 8: return 'Setembro';
      case 9: return 'Outubro';
      case 10: return 'Novembro';
      case 11: return 'Dezembro';
      default: return '';
    }
  }

  categoriaSelecionada: string;

  refresh(event): void {
    if (this.categoriaSelecionada !== localStorage.getItem("idCategoriaSumarioDashboard")){
      localStorage.setItem("idCategoriaSumarioDashboard",this.categoriaSelecionada);
      this._document.defaultView.location.reload();
    }
  }

}
