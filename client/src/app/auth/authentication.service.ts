import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem("icontas-token", token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("icontas-token");
    }
    return this.token;
  }

  private request(
    method: "post" | "get",
    type: "login" | "register" | "profile" ,
    user?: TokenPayload
  ): Observable<any> {
    let base$;

    if (method === "post") {
      base$ = this.http.post(`/api/${type}`, user);
    } else {
      base$ = this.http.get(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    }

    const request = base$.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("icontas-token");
    this.router.navigateByUrl("/");
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request("post", "register", user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request("post", "login", user);
  }


  public profile(): Observable<any> {
    const base$ = this.http.get(`/api/profile`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    return base$.pipe();
  }

  public updatePassword(user): Observable<any> {
    return this.http.post('/api/updPass', user, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      }).pipe(
        catchError(this.errorHandler)
      );
  }

  public profileById(id): Observable<any> {
    const base$ = this.http.get(`/api/profile/user/` + id, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    return base$.pipe();
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

}
