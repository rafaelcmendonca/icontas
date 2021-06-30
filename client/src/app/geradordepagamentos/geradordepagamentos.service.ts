import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export interface DialogData {
  idParent: string;
}

export class BodyGerador {
  conta: string;
  quantidade: number;
  valor: number;
  vencimento: Date;
  constructor(){}
}

@Injectable({
  providedIn: 'root'
})

export class GeradordepagamentosService {

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: { Authorization: `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json'
   }
  };

  gerarPagamentos(body): Observable<{}>{
    return this.http.post('/api/pagamento/gerar', JSON.stringify(body), this.httpOptions)
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
