import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../categoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Categoria } from '../categoria';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-categoria',
  templateUrl: './createcategoria.component.html',
  styleUrls: ['./createcategoria.component.css']
})
export class CreatecategoriaComponent implements OnInit {
  categoriaForm: FormGroup;
  model = new Categoria();
  parentId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public categoriaService: CategoriaService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.parentId = params.parentId;
    });
    // Inicia o formulário
    this.categoriaForm = new FormGroup({
      nome: new FormControl(this.model.nome, [
        Validators.required
      ]),
      descricao: new FormControl(this.model.descricao, [
        // TODO: Implementar custom validator para CPF e CPNPJ
      ])
    });
  }

  submitForm(): void {
    this.categoriaService.create(this.model).subscribe(res => {
      if (this.parentId) {
        this.router.navigateByUrl('/conta/edit/' + this.parentId);
      } else {
        this.router.navigateByUrl('/categoria');
      }
    });
  }

  voltar(): void {
    if (this.parentId) {
      this.router.navigateByUrl('/conta/edit/' + this.parentId);
    } else {
      this.router.navigateByUrl('/categoria');
    }
  }

  get nome(): any { return this.categoriaForm.get('nome'); }

  get descricao(): any { return this.categoriaForm.get('descricao'); }


}
