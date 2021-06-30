import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const TAX_ROUTES: Routes = [
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(TAX_ROUTES)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
