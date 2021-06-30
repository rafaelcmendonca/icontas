import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuard } from "./auth.guard";

export const AUTH_ROUTES: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent, canActivate: [AuthGuard] }, //Retirar canActivate quando for a primeira vez e o primeiro usuario
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(AUTH_ROUTES)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
