import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePagamentoComponent} from './create/create.component';
import { EditPagamentoComponent } from './edit/edit.component';
import { ListPagamentosComponent } from './home/home.component';
import { ListByContaComponent } from './listbyconta/listbyconta.component';


export const PAGAMENTO_ROUTES: Routes = [
  { path: '', component: ListPagamentosComponent },
  { path: 'edit/:pagamentoId', component: EditPagamentoComponent},
  { path: 'edit/:pagamentoId/:parentId', component: EditPagamentoComponent},
  { path: 'create/:contaId/:parentId', component: CreatePagamentoComponent}, // Cria um pagamento já passando a conta
  { path: 'listbyconta/:contaId', component: ListByContaComponent}, // Lista pagamentos por conta
];

@NgModule({
  imports: [RouterModule.forChild(PAGAMENTO_ROUTES)],
  exports: [RouterModule]
})
export class PagamentoRoutingModule { }
