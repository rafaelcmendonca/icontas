import { Component, OnInit, ViewChild } from '@angular/core';
import { ContaService } from '../conta.service';
import { Conta } from '../conta';
import { Router } from '@angular/router';
import { Empresa } from '../../empresa/empresa';
import { EmpresaService } from '../../empresa/empresa.service';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { Categoria } from 'src/app/categoria/categoria';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export class ContaData {
  _id: string;
  categoria: string;
  empresa: string;
  descricao: string;
  valor: number;
  status: number;
  constructor(){}
}

@Component({
  selector: 'app-list-contas',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ListContasComponent implements OnInit {
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  contas: Conta[] = [];
  contasData: ContaData[] = [];

  constructor(
    public contaService: ContaService,
    public categoriaService: CategoriaService,
    private router: Router,
    public empresaService: EmpresaService,
    private dialog: MatDialog
  ) { }

  getCategoriaName(id): string {
    return this.categorias.find(categoria => categoria._id === id).nome;
  }

  getEmpresaName(id): string {
    return this.empresas.find(empresa => empresa._id === id).nome;
  }

  ngOnInit(): void {
    this.empresaService.getAll().subscribe((data: Empresa[]) => {
      this.empresas = data;
      this.categoriaService.getAll().subscribe((data1: Categoria[]) => {
        this.categorias = data1;
        this.contaService.getAll().subscribe((data2: Conta[]) => {
          this.contas = data2;
          this.prepareTable();
        });
      });
    });
  }

  prepareTable(): void {
    this.contas.forEach(conta => {
      const data = new ContaData();
      data._id = conta._id;
      data.descricao = conta.descricao;
      if (conta.categoria) {
        data.categoria = this.getCategoriaName(conta.categoria);
      } else {
        data.categoria = 'N/A';
      }
      data.empresa = this.getEmpresaName(conta.empresa);
      data.valor = conta.valor;
      data.status = conta.status;
      this.contasData.push(data);
    });
    this.dataSource = new MatTableDataSource(this.contasData);
    this.displayedColumns = ['categoria', 'empresa', 'descricao', 'valor', 'status', 'acoes'];
    this.dataSource.sort = this.sort;
  }

  delete(id): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      mensagem1: 'Todos os pagamentos referentes a esta conta também serão apagados.',
      mensagem2: 'Deseja continuar?',
      botaoSim: true,
      botaoNao: true,
      botaoVoltar: false
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sim') {
        this.contaService.delete(id).subscribe(
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
    this.router.navigateByUrl('/conta/edit/' + id);
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
