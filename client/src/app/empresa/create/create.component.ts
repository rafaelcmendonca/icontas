import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { Router } from '@angular/router';
import { Empresa } from '../empresa';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  empresaForm: FormGroup;
  model = new Empresa();

  constructor(
    private router: Router,
    public empresaService: EmpresaService
  ){}

  ngOnInit(): void {
    // Inicia o formulário
    this.empresaForm = new FormGroup({
      nome: new FormControl(this.model.nome, [
        Validators.required
      ]),
      cpf: new FormControl(this.model.cpf, [
        // TODO: Implementar custom validator para CPF e CPNPJ
      ])
    });
  }

  submitForm(): void {
    this.empresaService.create(this.model).subscribe(res => {
      this.router.navigateByUrl('/empresa');
    });
  }

  voltar(): void {
    this.router.navigateByUrl('/empresa');
  }

  get nome(): any { return this.empresaForm.get('nome'); }

  get cpf(): any { return this.empresaForm.get('cpf'); }

}
