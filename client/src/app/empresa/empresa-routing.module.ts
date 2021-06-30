 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';

export const EMPRESA_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'edit/:empresaId', component: EditComponent},
  { path: 'create', component: CreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(EMPRESA_ROUTES)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
