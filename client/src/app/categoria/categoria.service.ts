import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Categoria } from './categoria';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) {}

  httpOptions = {
    headers: { 'Authorization': `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json'
   }
  };

  create(categoria): Observable<Categoria> {
    return this.http.post<Categoria>('/api/categoria/add', JSON.stringify(categoria), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getById(id): Observable<Categoria> {
    return this.http.get<Categoria>('/api/categoria/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('/api/categoria/', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  update(id, categoria): Observable<Categoria> {
    return this.http.put<Categoria>('/api/categoria/' + id, JSON.stringify(categoria), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id): Observable<{}>{
    return this.http.delete('/api/categoria/' + id, this.httpOptions)
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
