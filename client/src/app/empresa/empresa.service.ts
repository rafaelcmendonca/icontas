import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Empresa } from './empresa';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) {}

  httpOptions = {
    headers: { 'Authorization': `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json'
   }
  };

  create(empresa): Observable<Empresa> {
    return this.http.post<Empresa>('/api/empresa/add', JSON.stringify(empresa), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getById(id): Observable<Empresa> {
    return this.http.get<Empresa>('/api/empresa/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>('/api/empresa/', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  update(id, empresa): Observable<Empresa> {
    return this.http.put<Empresa>('/api/empresa/' + id, JSON.stringify(empresa), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id): Observable<{}>{
    return this.http.delete('/api/empresa/' + id, this.httpOptions)
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
