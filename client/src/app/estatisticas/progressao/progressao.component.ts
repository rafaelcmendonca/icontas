import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Conta } from '../../conta/conta';
import { Pagamento } from '../../pagamento/pagamento';
import { Categoria } from '../../categoria/categoria';
import { Empresa } from '../../empresa/empresa';
import { ContaService } from '../../conta/conta.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { EmpresaService } from '../../empresa/empresa.service';
import { PagamentoService } from '../../pagamento/pagamento.service';
import { LineOptions, LineData } from './lineoptions';

@Component({
  selector: 'app-progressao-chart',
  templateUrl: './progressao.component.html',
  styleUrls: ['./progressao.component.css']
})
export class ProgressaoComponent implements OnInit {
  lineCanvas: any;
  lineContext: any;
  lineChart: any;
  lineOptions = new LineOptions();
  lineData: LineData[] = [];

  constructor(
    public contaService: ContaService,
    public categoriaService: CategoriaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
  ) { }

  categorias: Categoria[] = [];
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentos: Pagamento[] = [];



  ngOnInit(): void {
    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
            this.iniciaChart();
            this.atualizaChart();
          });
        });
      });
    });
  }

  preparaDados(): void {
    this.lineData = [];
    this.pagamentos.sort(this.lineOptions.compareValues('dataVencimento', 'asc'));
    let total = 0;
    let mes = this.getItemMonth(this.pagamentos[0].dataVencimento);
    let ano = this.getItemYear(this.pagamentos[0].dataVencimento);
    this.pagamentos.forEach(pagamento => {
      const anoAtual = this.getItemYear(pagamento.dataVencimento);
      const mesAtual = this.getItemMonth(pagamento.dataVencimento);
      if (anoAtual !== ano) {
        const newItem = new LineData();
        newItem.valor = total;
        newItem.nome = this.lineOptions.getMonthString(mes) + ', ' + String(ano);
        if (this.isPast(mes, ano)) {
          if (total > 0) {
            this.lineData.push(newItem);
           }
        } else {
          this.lineData.push(newItem);
        }
        mes = mesAtual;
        ano = anoAtual;
        total = 0;
        // mudou o ano
      } else {
        if (mesAtual !== mes) {
          // mudou o mes
          const newItem = new LineData();
          newItem.valor = total;
          newItem.nome = this.lineOptions.getMonthString(mes) + ', ' + String(ano);
          if (this.isPast(mes, ano)) {
            if (total > 0) {
              this.lineData.push(newItem);
             }
          } else {
            this.lineData.push(newItem);
          }
          mes = mesAtual;
          ano = anoAtual;
          total = 0;
        }
      }
      if (pagamento.status) { // só soma se o pagamento nao foi pago ainda
        total = total + pagamento.valor;
      }
    });
    // ultimo item
    if (total > 0) {
      const newItem = new LineData();
      newItem.valor = total;
      newItem.nome = this.lineOptions.getMonthString(mes) + ', ' + String(ano);
      this.lineData.push(newItem);
    }

  }


  getCategoriaName(categoriaId): string {
    if (categoriaId) {
      return this.categorias.find(categoria => categoria._id === categoriaId).nome;
    } else {
      return 'N/A';
    }
  }

  getEmpresaName(idEmpresa): string {
    return this.empresas.find(empresa => empresa._id === idEmpresa).nome;
  }

  atualizaChart(): void {
    this.preparaDados();
    this.lineOptions.setData(this.lineData);
    this.lineChart.update();
  }

  iniciaChart(): void {
    this.lineCanvas = document.getElementById('linechart');
    this.lineContext = this.lineCanvas.getContext('2d');
    this.lineChart = new Chart(this.lineContext, this.lineOptions.ConfigOptions);
  }

  getItemMonth(data): number {
    const date = new Date(data);
    if (date) {
      return date.getMonth();
    } else {
      return -1;
    }
  }

  getItemYear(data): number {
    const date = new Date(data);
    if (date) {
      return date.getFullYear();
    } else {
      return -1;
    }
  }

  isPast(mes, ano): boolean {
    const today = new Date();
    if (ano > today.getFullYear()){
      return false;
    }
    if (ano < today.getFullYear()){
      return true;
    } else {
      if (mes < today.getMonth()){
        return true;
      } else {
        return false;
      }
    }
  }

}
