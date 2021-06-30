import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';
import { Router } from '@angular/router';
import { Conta } from 'src/app/conta/conta';
import { ContaService } from 'src/app/conta/conta.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export class EmpresaData {
  _id: string;
  nome: string;
  cpf: string;
  total: number;
  total_aberto: number;
  constructor(){}
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  empresaData: EmpresaData[] = [];

  constructor(
    public empresaService: EmpresaService,
    public contaService: ContaService,
    private router: Router,
    private dialog: MatDialog
  ) { }

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
        this.empresaService.delete(id).subscribe(
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
    this.router.navigateByUrl('/empresa/edit/' + id);
  }

  ngOnInit(): void {

    this.contaService.getAll().subscribe((cnt: Conta[]) => {
      this.contas = cnt;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.prepareTable();
      });
    });
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  prepareTable(): void {
    this.empresas.forEach(empresa => {
      const data = new EmpresaData();
      data._id = empresa._id;
      data.nome = empresa.nome;
      data.cpf = empresa.cpf;
      data.total = this.getValorTotal(empresa._id);
      data.total_aberto = this.getTotalAberto(empresa._id);
      this.empresaData.push(data);
    });
    this.dataSource = new MatTableDataSource(this.empresaData);
    this.displayedColumns = ['nome', 'cpf', 'total', 'total_aberto', 'acoes'];
    this.dataSource.sort = this.sort;
  }

  getValorTotal(empresaId): number {
    let total = 0;
    this.contas.forEach(conta => {
      if (conta.empresa === empresaId){
        total = total + conta.valor;
      }
    });
    return total;
  }

  getTotalAberto(empresaId): number {
    let total = 0;
    this.contas.forEach(conta => {
      if (conta.empresa === empresaId){
        if (conta.status === this.contaService.STANDARD_STATUS.ABERTA){
          total = total + conta.valor;
        }
      }
    });
    return total;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
