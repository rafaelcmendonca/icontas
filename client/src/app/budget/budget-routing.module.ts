import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowbudgetComponent } from './showbudget/showbudget.component'

export const BUDGET_ROUTES: Routes = [
  { path: '', component: ShowbudgetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(BUDGET_ROUTES)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
