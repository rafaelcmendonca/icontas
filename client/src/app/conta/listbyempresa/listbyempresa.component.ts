import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ContaService } from '../conta.service';
import { Conta } from '../conta';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-list-contas-by-empresa',
  templateUrl: './listbyempresa.component.html',
  styleUrls: ['./listbyempresa.component.css']
})
export class ListbyempresaComponent implements OnInit {
  @Input() idEmpresa: string;
  contas: Conta[] = [];
  dataSource;
  displayedColumns;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public contaService: ContaService,
    private router: Router,
    private dialog: MatDialog
  ) {
   }

  ngOnInit(): void {
      this.contaService.getByEmpresa(this.idEmpresa).subscribe((data1: Conta[]) => {
        this.contas = data1;
        this.dataSource = new MatTableDataSource(this.contas);
        this.displayedColumns = ['descricao', 'status', 'valor', 'acoes'];
        this.dataSource.sort = this.sort;
      });
  }

  getValorTotal(): number {
    let total = 0;
    this.contas.forEach(conta => {
      total = total + conta.valor;
    });
    return total;
  }

  getTotalAberto(): number {
    let total = 0;
    this.contas.forEach(conta => {
      if (conta.status === this.contaService.STANDARD_STATUS.ABERTA){
        total = total + conta.valor;
      }
    });
    return total;
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
    this.router.navigate(['/conta/edit/', id, this.idEmpresa]);
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
