import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagamento, PagamentoData } from '../pagamento';
import { PagamentoService } from '../pagamento.service';
import { ContaService } from '../../conta/conta.service';
import { Conta } from '../../conta/conta';
import { Router } from '@angular/router';
import { Empresa } from '../../empresa/empresa';
import { EmpresaService } from '../../empresa/empresa.service';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-pagamentos',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ListPagamentosComponent implements OnInit {
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  categorias: Categoria[] = [];
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentosFiltrados: Pagamento[] = [];
  pagamentos: Pagamento[] = [];
  pagamentosData: PagamentoData[] = [];
  showPagos = true;
  showPagosText = 'Mostrar Pagos';

  constructor(
    public contaService: ContaService,
    public categoriaService: CategoriaService,
    private router: Router,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
    private dialog: MatDialog
  ) { }

  getEmpresaName(idConta): string {
    const idEmpresa = this.contas.find(conta => conta._id === idConta).empresa;
    return this.empresas.find(empresa => empresa._id === idEmpresa).nome;
  }

  getConta(id): any {
    return this.contas.find(conta => conta._id === id);
  }

  getCategoriaName(contaId): string {
    const categoriaId = this.contas.find(conta => conta._id === contaId).categoria;
    if (categoriaId) {
      return this.categorias.find(categoria => categoria._id === categoriaId).nome;
    } else {
      return 'N/A';
    }
  }

  prepareTable(): void {
    this.pagamentosData = [];
    this.pagamentosFiltrados.forEach(pagamento => {
      const data = new PagamentoData();
      data._id = pagamento._id;
      data.categoria = this.getCategoriaName(pagamento.conta);
      data.empresa = this.getEmpresaName(pagamento.conta);
      data.conta = this.getConta(pagamento.conta).descricao;
      data.vencimento = pagamento.dataVencimento;
      data.pagamento = pagamento.dataPagamento;
      data.alerta = pagamento.alerta;
      data.valor = pagamento.valor;
      data.status = pagamento.status;
      data.descricao = pagamento.descricao;
      this.pagamentosData.push(data);
    });
    this.dataSource = new MatTableDataSource(this.pagamentosData);
    this.displayedColumns = ['categoria', 'empresa', 'conta', 'vencimento', 'pagamento', 'valor', 'status', 'descricao', 'acoes', 'alerta'];
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
            this.toggleShowPagos();
          });
        });
      });
    });
  }

  delete(id): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      mensagem1: 'Todas as contas e pagamentos referentes a esta empresa também serão apagados.',
      mensagem2: 'Deseja continuar?',
      botaoSim: true,
      botaoNao: true,
      botaoVoltar: false
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sim') {
        this.pagamentoService.delete(id).subscribe(
          res => {
            this.reloadCurrentRoute();
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  edit(id): void {
    this.router.navigateByUrl('/pagamento/edit/' + id);
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public isAtrasado(pagamento: PagamentoData): boolean {
    const hoje = new Date();
    const vencimento = new Date(pagamento.vencimento);
    if ((hoje > vencimento) && (pagamento.status)) {
      return true;
    } else {
      return false;
    }
  }

  public toggleShowPagos(): void {
    this.showPagos = !this.showPagos;

    if (!this.showPagos){
      this.pagamentosFiltrados = this.pagamentos.filter(pagamento => pagamento.status === this.pagamentoService.STANDARD_STATUS.EM_HAVER);
      this.showPagosText = 'Mostrar Pagos';
    } else {
      this.showPagosText = 'Esconder Pagos';
      this.pagamentosFiltrados = this.pagamentos;
    }
    this.prepareTable();
  }

  public isAVencer(pagamento: PagamentoData): boolean {
    const vencimento = new Date(pagamento.vencimento);
    const date = new Date();
    if (date > vencimento) {
      return false;
    } else {
      date.setDate(date.getDate() + pagamento.alerta);
      if ((date > vencimento) && (pagamento.status)) {
        return true;
      } else {
        return false;
      }
    }
  }

}
