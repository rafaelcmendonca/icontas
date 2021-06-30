import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService, TokenPayload, UserDetails } from "../authentication.service";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  details: UserDetails;
  usuario: TokenPayload = {
    email: "",
    name: "",
    password: ""
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user;
        this.usuario.email = this.details.email;
        this.usuario.name = this.details.name;
      },
      err => {
        console.error(err);
      }
    );
  }

  updatePassword(): void {
    this.auth.updatePassword(this.usuario).subscribe(
      () => {
        this.router.navigateByUrl("/auth/profile");
      },
      err => {
        console.error(err);
      }
    );
  }
}
