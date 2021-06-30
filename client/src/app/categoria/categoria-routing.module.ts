import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatecategoriaComponent } from './createcategoria/createcategoria.component';
import { EditcategoriaComponent } from './editcategoria/editcategoria.component';
import { ListcategoriaComponent } from './listcategoria/listcategoria.component';

export const CATEGORIA_ROUTES: Routes = [
  { path: '', component: ListcategoriaComponent },
  { path: 'edit/:categoriaId', component: EditcategoriaComponent},
  { path: 'create', component: CreatecategoriaComponent},
  { path: 'create/:parentId', component: CreatecategoriaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(CATEGORIA_ROUTES)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
