import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Conta } from './conta';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) {}

  STANDARD_STATUS = {
    FECHADA : 0,
    ABERTA : 1
  };

  STANDARD_TYPE = {
    NORMAL : 0,
    MENSAL : 1,
    ANUAL : 2
  };

  STANDARD_OBJETO = {
    ORDINARIA : "0",
    SERVICO: "1",
    MATERIAL: "2"
  };

  httpOptions = {
    headers: { Authorization: `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json'
   }
  };

  create(conta): Observable<Conta> {
    return this.http.post<Conta>('/api/conta/add', JSON.stringify(conta), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getById(id): Observable<Conta> {
    return this.http.get<Conta>('/api/conta/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getByEmpresa(id): Observable<Conta[]> {
    return this.http.get<Conta[]>('/api/conta/byempresa/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getAll(): Observable<Conta[]> {
    return this.http.get<Conta[]>('/api/conta/', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  update(id, conta): Observable<Conta> {
    return this.http.put<Conta>('/api/conta/' + id, JSON.stringify(conta), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id): Observable<{}>{
    return this.http.delete('/api/conta/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
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
