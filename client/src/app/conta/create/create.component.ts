import { Component, OnInit, Input } from '@angular/core';
import { ContaService } from '../conta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Conta } from '../conta';
import { Empresa } from '../../empresa/empresa';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';

@Component({
  selector: 'app-create-conta',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateContaComponent implements OnInit {
  contaForm: FormGroup;
  idEmpresa: string;
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  model = new Conta();
  valorString;
  parentId: string;

  constructor(
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private route: ActivatedRoute,
    public contaService: ContaService,
    public empresaService: EmpresaService,
    public categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.model.tipo = 0;
    this.model.alerta = 5;
    this.model.parcelas = 1;
    this.model.entrada = 0;
    this.model.valor = 0;
    this.model.valorparcelas = 0;
    this.model.objeto = this.contaService.STANDARD_OBJETO.ORDINARIA;
    this.contaForm = new FormGroup({
      empresa: new FormControl(this.model.empresa, [
        Validators.required,
        Validators.minLength(5)
      ]),
      categoria: new FormControl(this.model.categoria, [
        // not required
      ]),
      objeto: new FormControl(this.model.objeto, [
        // not required
      ]),
      valor: new FormControl(this.model.valor, [
        Validators.required
      ]),
      descricao: new FormControl(this.model.descricao, [
        Validators.required
      ]),
      vencimento: new FormControl(this.model.vencimento, [
        Validators.required
      ]),
      tipo: new FormControl(this.model.tipo, []),
      forma: new FormControl(this.model.forma, [
        Validators.required
      ]),
      entrada: new FormControl(this.model.entrada, [
        Validators.required
      ]),
      parcelas: new FormControl(this.model.parcelas, [
        Validators.required
      ]),
      valorparcelas: new FormControl(this.model.valorparcelas, [
        Validators.required
      ])
    });

//    this.periodicidadeForm = new FormGroup({
//      vencimento: new FormControl(this.model.vencimento, [
//        Validators.required
//      ]),
//      tipo: new FormControl(this.model.tipo, [])
//    });

    this.route.params.subscribe(params => {
      this.model.empresa = params.empresaId;
      this.parentId = params.empresaId;
    });
    this.model.descricao = '';

    this.empresaService.getAll().subscribe((data: Empresa[]) => {
      this.empresas = data;
    });

    this.categoriaService.getAll().subscribe((data: Categoria[]) => {
      this.categorias = data;
      console.log(this.categorias);
    });
  }

  criarEmpresa(): void {
    this.router.navigateByUrl('/empresa/create');
  }

  criarCategoria(): void {
    this.router.navigateByUrl('/categoria/create');
  }

  checaTipo(): void {
    if (this.model.tipo > 0) {
      this.model.forma = 1;
    }
  }

  checaForma(): void {
    if (this.model.forma == 2) {
      this.model.tipo = 0;
    }
  }

  submitForm(): void {
      this.contaService.create(this.model).subscribe(res => {
        if (this.parentId) {
          this.router.navigateByUrl('/empresa/edit/' + this.parentId);
        } else {
          this.router.navigateByUrl('/conta');
        }
      });
  }

  voltar(): void {
    if (this.parentId) {
      this.router.navigateByUrl('/empresa/edit/' + this.parentId);
    } else {
      this.router.navigateByUrl('/conta');
    }
  }

  empresaError(): void { }

  transformValor(element): void {
    if (Number(this.valorString)) {
      this.model.valor = Number(this.valorString);
      this.valorString = this.currencyPipe.transform(this.valorString, 'R$ ');
    } else {
      this.valorString = '';
    }
    element.target.value = this.model.valor;
  }

  get empresa(): any { return this.contaForm.get('empresa'); }
  get valor(): any { return this.contaForm.get('valor'); }
  get descricao(): any { return this.contaForm.get('descricao'); }
  get categoria(): any { return this.contaForm.get('categoria'); }
  get objeto(): any { return this.contaForm.get('objeto'); }
  get tipo(): any { return this.contaForm.get('tipo'); }
  get vencimento(): any { return this.contaForm.get('vencimento'); }
  get forma(): any { return this.contaForm.get('forma'); }
  get entrada(): any { return this.contaForm.get('entrada'); }
  get parcelas(): any { return this.contaForm.get('parcelas'); }
  get valorparcelas(): any { return this.contaForm.get('valorparcelas'); }

  get formsValid(): boolean {
    let result = false;
    if ((this.model.tipo > 0) && (!this.contaForm.invalid)) {
        result = true;
    }
    if ((this.model.tipo == 0) && (!this.contaForm.invalid)) {
      result = true;
    }
    if (this.model.alerta <= 0){
      result = false;
    }
    return result;
  }


}
