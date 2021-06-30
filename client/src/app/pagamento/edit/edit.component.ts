import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../empresa/empresa';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../empresa/empresa.service';
import { Conta } from '../../conta/conta';
import { ContaService } from '../../conta/conta.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Pagamento } from '../pagamento';
import { PagamentoService } from '../pagamento.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-pagamento',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditPagamentoComponent implements OnInit {
  pagamentoForm: FormGroup;
  owner = '';
  model = new Pagamento();
  empresaName = '';
  conta = new Conta();
  toggleSwitch: boolean;
  loggedUserName = '';
  pagoPorName = '';
  valorString;
  parentId: string;

  constructor(
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private route: ActivatedRoute,
    public contaService: ContaService,
    public empresaService: EmpresaService,
    private auth: AuthenticationService,
    public pagamentoService: PagamentoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pagamentoForm = new FormGroup({
      descricao: new FormControl(this.model.descricao),
      valor: new FormControl(this.model.valor, [
        Validators.required
      ]),
      status: new FormControl(this.model.status),
      dataVencimento: new FormControl(this.model.dataVencimento, [
        Validators.required
      ]),
      dataPagamento: new FormControl(this.model.dataPagamento),
    });

    this.getLoggedUser();

    this.route.params.subscribe(params => {
      this.model._id = params.pagamentoId;
      if (params.parentId) {
        this.parentId = params.parentId;
      }
    });

    this.pagamentoService.getById(this.model._id).subscribe((data: Pagamento) => {
      this.model = data;
      this.getConta(data.conta);
      this.getOwner(data.criadoPor);
      this.valorString = this.currencyPipe.transform(this.model.valor, 'R$ ');
      if (data.status === 1){
        this.toggleSwitch = true;
      } else {
        this.toggleSwitch = false;
        this.getPagoPor(data.pagoPor);
      }
    });

  }

  toggleStatusSwitch(): void {
    this.toggleSwitch =  !this.toggleSwitch;
    if (!this.toggleSwitch) {
      this.model.pagoPor = this.auth.getUserDetails()?._id;
      this.model.dataPagamento = new Date();
      this.pagoPorName = this.loggedUserName;
    } else {
      this.model.dataPagamento = null;
    }
  }

  private getEmpresaName(id): void {
    this.empresaService.getById(id).subscribe((data: Empresa) => {
      this.empresaName = data.nome;
    });
  }

  private getConta(id): void {
    this.contaService.getById(id).subscribe((data: Conta) => {
      this.conta = data;
      this.getEmpresaName(data.empresa);
    });
  }

  private getOwner(id): void{
    this.auth.profileById(id).subscribe(user => {
        this.owner = user.name;
      },
      err => {
        console.error(err);
      }
    );
  }

  private getLoggedUser(): void{
    if (this.auth.getUserDetails()?._id){
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

  private getPagoPor(id): void{
    this.auth.profileById(id).subscribe(user => {
        this.pagoPorName = user.name;
      },
      err => {
        console.error(err);
      }
    );
  }

  submitForm(): void {
    if (this.toggleSwitch) {
      this.model.status = 1;
    } else {
      this.model.status = 0;
    }
    this.pagamentoService.update(this.model._id, this.model).subscribe(res => {
      if (this.parentId) {
        this.router.navigateByUrl('/conta/edit/' + this.parentId);
      } else {
        this.router.navigateByUrl('/pagamento');
      }
    });
  }

  voltar(): void {
    if (this.parentId) {
      this.router.navigateByUrl('/conta/edit/' + this.parentId);
    } else {
      this.router.navigateByUrl('/pagamento');
    }
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
            if (this.parentId) {
              this.router.navigateByUrl('/conta/edit/' + this.parentId);
            } else {
              this.router.navigateByUrl('/pagamento');
            }
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  pay(): void {
    this.model.pagoPor = this.auth.getUserDetails()?._id;
    this.pagoPorName = this.loggedUserName;
    this.toggleSwitch = false;
    console.log('Pago!');
  }

  transformValor(element): void{
    if (Number(this.valorString)){
      this.model.valor = Number(this.valorString);
      this.valorString = this.currencyPipe.transform(this.valorString, 'R$ ');
    } else {
      this.valorString = '';
    }
    element.target.value = this.model.valor;
  }

  get descricao(): any { return this.pagamentoForm.get('descricao'); }
  get valor(): any { return this.pagamentoForm.get('valor'); }
  get status(): any { return this.pagamentoForm.get('status'); }
  get dataVencimento(): any { return this.pagamentoForm.get('dataVencimento'); }
  get dataPagamento(): any { return this.pagamentoForm.get('dataPagamento'); }


}
