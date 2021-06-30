import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Conta } from 'src/app/conta/conta';
import { ContaService } from 'src/app/conta/conta.service';
import { Empresa } from 'src/app/empresa/empresa';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { Pagamento, PagamentoData } from 'src/app/pagamento/pagamento';
import { PagamentoService } from 'src/app/pagamento/pagamento.service';

@Component({
  selector: 'app-resultado-mensal',
  templateUrl: './mensal.component.html',
  styleUrls: ['./mensal.component.css']
})
export class MensalComponent implements OnInit {
  @Input() mes: number;
  @Input() ano: number;
  @Input() categoria: string;
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pagamentosData: PagamentoData[] = [];
  pagamentos: Pagamento[] = [];
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentosFiltrados: Pagamento[] = [];
  total: number = 0;
  totalOrdinarias: number = 0;
  totalServico: number = 0;
  totalMaterial: number = 0;


  constructor(
    public contaService: ContaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
  ) { }

  ngOnInit(): void {
    this.empresaService.getAll().subscribe((data: Empresa[]) => {
      this.empresas = data;
      this.contaService.getAll().subscribe((data1: Conta[]) => {
        this.contas = data1;
        this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
          this.pagamentos = data2;
          this.prepareTable();
        });
      });
    });
  }

  getEmpresaName(idConta): string {
    const idEmpresa = this.contas.find(conta => conta._id === idConta).empresa;
    return this.empresas.find(empresa => empresa._id === idEmpresa).nome;
  }

  getConta(id): any {
    return this.contas.find(conta => conta._id === id);
  }

  contaBelongToCategoria(id): any {
    if (this.getConta(id).categoria === this.categoria)
      return true
    else
      return false
  }

  prepareTable(): void {
    this.pagamentosFiltrados = this.pagamentos.filter(pagamento => (new Date(pagamento.dataPagamento).getMonth() === this.mes) && (new Date(pagamento.dataPagamento).getFullYear() === this.ano));
    this.pagamentosFiltrados = this.pagamentosFiltrados.filter(pagamento => this.contaBelongToCategoria(pagamento.conta));
    this.pagamentosData = [];
    this.pagamentosFiltrados.forEach(pagamento => {
      const data = new PagamentoData();
      data._id = pagamento._id;
      data.empresa = this.getEmpresaName(pagamento.conta);
      data.conta = this.getConta(pagamento.conta).descricao;
      data.vencimento = pagamento.dataVencimento;
      data.pagamento = pagamento.dataPagamento;
      data.alerta = pagamento.alerta;
      data.valor = pagamento.valor;
      data.status = pagamento.status;
      data.descricao = pagamento.descricao;
      this.pagamentosData.push(data);
      this.total += data.valor;
      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.ORDINARIA)
        this.totalOrdinarias += pagamento.valor;
      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.SERVICO)
        this.totalServico += pagamento.valor;
      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.MATERIAL)
        this.totalMaterial += pagamento.valor;

    });
    this.dataSource = new MatTableDataSource(this.pagamentosData);
    this.displayedColumns = ['empresa', 'conta', 'pagamento', 'valor', 'descricao'];
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMonthString(month): string {
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

}
