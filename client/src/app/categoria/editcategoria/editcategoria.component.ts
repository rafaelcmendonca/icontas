import { Component, OnInit } from '@angular/core';
import { Categoria } from '../categoria';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-categoria',
  templateUrl: './editcategoria.component.html',
  styleUrls: ['./editcategoria.component.css']
})
export class EditcategoriaComponent implements OnInit {
  formulario: FormGroup;
  owner = '';
  model = new Categoria();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public categoriaService: CategoriaService,
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
      descricao: new FormControl(this.model.descricao, [
        // TODO: Implementar custom validator para CPF e CPNPJ
      ])
    });

    this.route.params.subscribe(params => {
      this.model._id = params.categoriaId;
    });
    this.categoriaService.getById(this.model._id).subscribe((data: Categoria) => {
      this.model = data;
      this.getOwner(data.criadoPor);
    });
  }

  submitForm(): void {
    this.categoriaService.update(this.model._id, this.model).subscribe(res => {
      this.router.navigateByUrl('/categoria');
    });
  }

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
            this.router.navigateByUrl('/categoria');
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

  get nome(): any { return this.formulario.get('nome'); }

  get descricao(): any { return this.formulario.get('descricao'); }

}
