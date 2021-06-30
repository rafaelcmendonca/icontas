import { Component, OnInit } from '@angular/core';
import { Empresa } from '../empresa';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  formulario: FormGroup;
  owner = '';
  model = new Empresa();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public empresaService: EmpresaService,
    private auth: AuthenticationService,
    public dialog: MatDialog
  ){}

  private getOwner(id): void {
    this.auth.profileById(id).subscribe(
      user => {
        this.owner = user.name;
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    // Inicia o formulário
    this.formulario = new FormGroup({
      nome: new FormControl(this.model.nome, [
        Validators.required
      ]),
      cpf: new FormControl(this.model.cpf, [
        // TODO: Implementar custom validator para CPF e CPNPJ
      ])
    });

    this.route.params.subscribe(params => {
      this.model._id = params.empresaId;
    });
    this.empresaService.getById(this.model._id).subscribe((data: Empresa) => {
      this.model = data;
      this.getOwner(data.criadoPor);
    });
  }

  criarConta(): void {
    this.router.navigateByUrl('/conta/create/' + this.model._id);
  }

  submitForm(): void {
    this.empresaService.update(this.model._id, this.model).subscribe(res => {
      this.router.navigateByUrl('/empresa');
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
        this.empresaService.delete(id).subscribe(
          res => {
            this.router.navigateByUrl('/empresa');
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  get nome(): any { return this.formulario.get('nome'); }

  get cpf(): any { return this.formulario.get('cpf'); }

}
