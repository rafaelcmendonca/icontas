import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Pagamento } from './pagamento';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  STANDARD_STATUS = {
    PAGO : 0,
    EM_HAVER : 1
  };

  httpOptions = {
    headers: { Authorization: `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json'
   }
  };

  create(pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>('/api/pagamento/add', JSON.stringify(pagamento), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getById(id): Observable<Pagamento> {
    return this.http.get<Pagamento>('/api/pagamento/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getByConta(id): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>('/api/pagamento/byconta/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getTotalPagamentos(id): Observable<number> {
    return this.http.get<number>('/api/pagamento/total/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>('/api/pagamento/', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  update(id, pagamento): Observable<Pagamento> {
    return this.http.put<Pagamento>('/api/pagamento/' + id, JSON.stringify(pagamento), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id): Observable<{}>{
    return this.http.delete('/api/pagamento/' + id, this.httpOptions)
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
