import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListContasComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CreateContaComponent } from './create/create.component';
import { ListbyempresaComponent } from './listbyempresa/listbyempresa.component';

export const CONTA_ROUTES: Routes = [
  { path: '', component: ListContasComponent },
  { path: 'edit/:contaId', component: EditComponent},
  { path: 'edit/:contaId/:parentId', component: EditComponent},
  { path: 'create', component: CreateContaComponent},
  { path: 'create/:empresaId', component: CreateContaComponent}, // Cria uma conta já passando a empresa
  { path: 'listbyempresa/:empresaId', component: ListbyempresaComponent}, // Lista contas por empresa
];

@NgModule({
  imports: [RouterModule.forChild(CONTA_ROUTES)],
  exports: [RouterModule]
})
export class ContaRoutingModule { }
