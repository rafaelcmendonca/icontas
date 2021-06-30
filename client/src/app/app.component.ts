import { Component } from '@angular/core';
import { AuthenticationService, UserDetails} from './auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userName = '';
  userId: string;
  title = 'iContas';
  constructor(public auth: AuthenticationService) {}

  ngOnInit() {
    this.userId = this.auth.getUserDetails()?._id;
    if (this.userId){
      this.auth.profileById(this.userId).subscribe(
        user => {
          this.userName = user.name;
        },
        err => {
          console.error(err);
        }
      );
    }
  }
}
