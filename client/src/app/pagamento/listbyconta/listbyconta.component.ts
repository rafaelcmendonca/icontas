import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PagamentoService } from '../pagamento.service';
import { Pagamento, PagamentoData } from '../pagamento';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-list-pagamento-by-conta',
  templateUrl: './listbyconta.component.html',
  styleUrls: ['./listbyconta.component.css']
})
export class ListByContaComponent implements OnInit {
  @Input() idConta: string;
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  pagamentosData: PagamentoData[] = [];
  pagamentos: Pagamento[] = [];
  totalPago: number = 0;
  totalEmHaver: number = 0;

  constructor(
    private router: Router,
    public pagamentoService: PagamentoService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pagamentoService.getByConta(this.idConta).subscribe((data: Pagamento[]) => {
      this.pagamentos = data;
      this.prepareTable();
    });
  }


  prepareTable(): void {
    this.pagamentos.forEach(pagamento => {
      const data = new PagamentoData();
      data._id = pagamento._id;
      data.vencimento = pagamento.dataVencimento;
      data.valor = pagamento.valor;
      data.status = pagamento.status;
      data.descricao = pagamento.descricao;
      this.pagamentosData.push(data);

      if (pagamento.status === this.pagamentoService.STANDARD_STATUS.PAGO) {
        this.totalPago += pagamento.valor;
      }
      if (pagamento.status === this.pagamentoService.STANDARD_STATUS.EM_HAVER){
        this.totalEmHaver += pagamento.valor;
      }

    });
    this.dataSource = new MatTableDataSource(this.pagamentosData);
    this.displayedColumns = ['payment' ,'descricao', 'vencimento', 'valor', 'status', 'acoes'];
    this.dataSource.sort = this.sort;
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

  edit(id): void{
    this.router.navigateByUrl('/pagamento/edit/' + id + '/' + this.idConta);
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
