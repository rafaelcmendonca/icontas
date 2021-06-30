import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  authForm: FormGroup;

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(this.credentials.email, [
        Validators.required
      ]),
      password: new FormControl(this.credentials.password, [
        Validators.required
      ])
    });
  }

  login(): void {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        this.credentials.password = '';
        console.error(err);
      }
    );
  }

  get email(): any { return this.authForm.get('email'); }
  get password(): any { return this.authForm.get('password'); }
}
