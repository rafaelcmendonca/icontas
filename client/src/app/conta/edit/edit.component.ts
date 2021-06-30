import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../empresa/empresa';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../empresa/empresa.service';
import { Conta } from '../conta';
import { ContaService } from '../conta.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { GeradordepagamentosdialogComponent } from 'src/app/geradordepagamentos/geradordepagamentosdialog/geradordepagamentosdialog.component';
import { Pagamento } from 'src/app/pagamento/pagamento';
import { PagamentoService } from 'src/app/pagamento/pagamento.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  categorias: Categoria[] = [];
  contaForm: FormGroup;
  owner = '';
  model = new Conta();
  empresaName = '';
  toggleSwitch: boolean;
  loggedUserName = '';
  fechadoPorName = '';
  valorString;
  parentId: string;
  testeValor: number;

  constructor(
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private route: ActivatedRoute,
    public contaService: ContaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
    public categoriaService: CategoriaService,
    private auth: AuthenticationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.contaForm = new FormGroup({
      empresaname: new FormControl({ value: this.empresaName, disabled: true }, []),
      categoria: new FormControl(this.model.categoria, []),
      objeto: new FormControl(this.model.objeto, []),
      valor: new FormControl(this.model.valor, [
        Validators.required
      ]),
      descricao: new FormControl(this.model.descricao, [
        Validators.required
      ])
    });

    this.getLoggedUser();
    this.route.params.subscribe(params => {
      this.model._id = params.contaId;
      if (params.parentId) {
        this.parentId = params.parentId;
      }
    });

    this.categoriaService.getAll().subscribe((data1: Categoria[]) => {
      this.categorias = data1;
      this.contaService.getById(this.model._id).subscribe((data: Conta) => {
        this.model = data;
        this.getEmpresaName(data.empresa);
        this.getOwner(data.criadoPor);
        this.valorString = this.currencyPipe.transform(this.model.valor, 'R$ ');
        if (data.status === 1) {
          this.toggleSwitch = true;
        } else {
          this.toggleSwitch = false;
          this.getFechadoPor(data.fechadoPor);
        }
      });
    });
  }

  toggleStatusSwitch(): void {
    this.toggleSwitch = !this.toggleSwitch;
    if (!this.toggleSwitch) {
      this.model.fechadoPor = this.auth.getUserDetails()?._id;
      this.model.fechadoEm = new Date();
      this.fechadoPorName = this.loggedUserName;
    }
  }

  getEmpresaName(id): void {
    this.empresaService.getById(id).subscribe((data: Empresa) => {
      this.empresaName = data.nome;
    });
  }

  private getOwner(id): void {
    this.auth.profileById(id).subscribe(user => {
      this.owner = user.name;
    },
      err => {
        console.error(err);
      }
    );
  }

  private getFechadoPor(id): void {
    this.auth.profileById(id).subscribe(user => {
      this.fechadoPorName = user.name;
    },
      err => {
        console.error(err);
      }
    );
  }

  private getLoggedUser(): void {
    if (this.auth.getUserDetails()?._id) {
      this.auth.profileById(this.auth.getUserDetails()?._id).subscribe(
        user => {
          this.loggedUserName = user.name;
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  submitForm(): void {
    if (this.toggleSwitch) {
      this.model.status = 1;
    } else {
      this.model.status = 0;
    }
    this.pagamentoService.getTotalPagamentos(this.model._id).subscribe(total => {
      if (total !== this.model.valor) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          mensagem1: 'O valor total desta conta não bate com a soma dos pagamentos.',
          mensagem2: 'Deseja ajustar o valor da conta?',
          botaoSim: true,
          botaoNao: true,
          botaoVoltar: true
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'sim') {
            this.model.valor = total;
            this.salvaConta();
          }
          if (result === 'nao') {
            this.salvaConta();
          }
        });
      } else {
        this.salvaConta();
      }
    });
  }

  salvaConta(): void {
    this.contaService.update(this.model._id, this.model).subscribe(res => {
      if (this.parentId) {
        this.router.navigateByUrl('/empresa/edit/' + this.parentId);
      } else {
        this.router.navigateByUrl('/conta');
      }
    });
  }

  criarPagamento(): void {
    this.router.navigateByUrl('/pagamento/create/' + this.model._id + '/' + this.model._id);
  }

  voltar(): void {
    if (this.parentId) {
      this.router.navigateByUrl('/empresa/edit/' + this.parentId);
    } else {
      this.router.navigateByUrl('/conta');
    }
  }

  criarCategoria(): void {
    this.router.navigateByUrl('/categoria/create');
  }

  delete(id): void {
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
            this.router.navigateByUrl('/conta');
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  openGeradorDePagamentos(): void {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { idParent: this.model._id }
    this.dialog.open(GeradordepagamentosdialogComponent, dialogConfig);
  }

  transformValor(element): void {
    console.log("ativou");
    if (Number(this.valorString)) {
      this.model.valor = Number(this.valorString);
      this.valorString = this.currencyPipe.transform(this.valorString, 'R$ ');
    } else {
      this.valorString = '';
    }
    element.target.value = this.model.valor;
  }

  get valor(): any { return this.contaForm.get('valor'); }
  get descricao(): any { return this.contaForm.get('descricao'); }
  get categoria(): any { return this.contaForm.get('categoria'); }
  get objeto(): any { return this.contaForm.get('objeto'); }

  get formsValid(): boolean {
    let result = true;
    if (this.contaForm.invalid) {
      result = false;
    }
    if (this.model.alerta <= 0){
      result = false;
    }
    return result;
  }





}
