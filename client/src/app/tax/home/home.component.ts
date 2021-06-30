import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { Conta } from 'src/app/conta/conta';
import { ContaService } from 'src/app/conta/conta.service';
import { Empresa } from 'src/app/empresa/empresa';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { Pagamento } from 'src/app/pagamento/pagamento';
import { PagamentoService } from 'src/app/pagamento/pagamento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentosFiltrados: Pagamento[] = [];
  pagamentos: Pagamento[] = [];
  categorias: Categoria[] = [];
  anoBase: number;
  newAnoBase: number;
  categoriaSelecionada: string;
  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  totalAnual: number = 0;
  totalOrdinarias: number = 0;
  totalServico: number = 0;
  totalMaterial: number = 0;

  constructor(
    public contaService: ContaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
    public categoriaService: CategoriaService,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  refresh(event): void {
    if (this.anoBase !== Number(localStorage.getItem("anoBaseIRPF"))){
      localStorage.setItem("anoBaseIRPF", this.anoBase.toString());
      this._document.defaultView.location.reload();
    }
    if (this.categoriaSelecionada !== localStorage.getItem("idCategoriaIRPF")){
      localStorage.setItem("idCategoriaIRPF",this.categoriaSelecionada);
      this._document.defaultView.location.reload();
    }
  }


  ngOnInit(): void {
    if (Number(localStorage.getItem("anoBaseIRPF"))) {
      this.anoBase = Number(localStorage.getItem("anoBaseIRPF"));
    } else {
      this.anoBase = 2020;
    }

    this.categoriaSelecionada = localStorage.getItem("idCategoriaIRPF");

    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
            this.calculaTotal();
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


  calculaTotal(): void {
    this.pagamentosFiltrados = this.pagamentos.filter(pagamento => new Date(pagamento.dataPagamento).getFullYear() === this.anoBase);
    this.pagamentosFiltrados = this.pagamentosFiltrados.filter(pagamento => this.contaBelongToCategoria(pagamento.conta));
    this.pagamentosFiltrados.forEach(pagamento => {
      this.totalAnual += pagamento.valor;

      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.ORDINARIA)
        this.totalOrdinarias += pagamento.valor;
      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.SERVICO)
        this.totalServico += pagamento.valor;
      if (this.getConta(pagamento.conta).objeto === this.contaService.STANDARD_OBJETO.MATERIAL)
        this.totalMaterial += pagamento.valor;

    });
  }
}
