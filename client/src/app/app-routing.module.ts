import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AUTH_ROUTES} from './auth/auth-routing.module';
import { CATEGORIA_ROUTES } from './categoria/categoria-routing.module';
import { EMPRESA_ROUTES} from './empresa/empresa-routing.module';
import { CONTA_ROUTES } from './conta/conta-routing.module';
import { PAGAMENTO_ROUTES } from './pagamento/pagamento-routing.module';
import { NotfoundComponent } from './notfound/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TAX_ROUTES } from './tax/tax-routing.module';
import { BUDGET_ROUTES} from './budget/budget-routing.module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'auth', children: AUTH_ROUTES},
  { path: 'categoria', children: CATEGORIA_ROUTES, canActivate: [AuthGuard] },
  { path: 'empresa', children: EMPRESA_ROUTES, canActivate: [AuthGuard] },
  { path: 'conta', children: CONTA_ROUTES, canActivate: [AuthGuard] },
  { path: 'pagamento', children: PAGAMENTO_ROUTES, canActivate: [AuthGuard] },
  { path: 'tax', children: TAX_ROUTES, canActivate: [AuthGuard] },
  { path: 'budget', children: BUDGET_ROUTES, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
