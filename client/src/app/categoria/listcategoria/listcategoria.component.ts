import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-list-categoria',
  templateUrl: './listcategoria.component.html',
  styleUrls: ['./listcategoria.component.css']
})
export class ListcategoriaComponent implements OnInit {
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  categorias: Categoria[] = [];

  constructor(
    public categoriaService: CategoriaService,
    private router: Router,
    private dialog: MatDialog
    ) { }

  delete(id): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      mensagem1: 'Todas as contas e pagamentos associados a esta categoria também serão apagados.',
      mensagem2: 'Deseja continuar?',
      botaoSim: true,
      botaoNao: true,
      botaoVoltar: false
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sim') {
        this.categoriaService.delete(id).subscribe(
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
    this.router.navigateByUrl('/categoria/edit/' + id);
  }

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe((data: Categoria[]) => {
      this.categorias = data;
      this.prepareTable();
    });
  }

  prepareTable(): void {
    this.dataSource = new MatTableDataSource(this.categorias);
    this.displayedColumns = ['nome', 'descricao', 'acoes'];
    this.dataSource.sort = this.sort;
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
