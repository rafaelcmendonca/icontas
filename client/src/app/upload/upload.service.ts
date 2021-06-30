import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { throwError, Subject, Observable } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';
import { Anexo } from './anexo';
import { catchError } from 'rxjs/operators';

export interface DialogData {
  type: string;
  idParent: string;
}

@Injectable()
export class UploadService {
  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  token = 'Bearer ' + this.auth.getToken();
  headersRafa = new HttpHeaders({ Authorization: this.token});
  httpOptions = {
    headers: this.headersRafa,
   reportProgress: true
  };
  httpOptionsFile = {
    headers: this.headersRafa,
   reportProgress: true,
   responseType: 'blob' as 'json'
  };


  public upload(anexo: Anexo): Observable<number>  {
    const status: { [key: string]: { progress: Observable<number> } } = {};
    const formData: FormData = new FormData();
    formData.append('file', anexo.file, anexo.file.name);
    formData.append('descricao', anexo.descricao);
    formData.append('conta', anexo.conta);
    formData.append('empresa', anexo.empresa);
    formData.append('pagamento', anexo.pagamento);
    const req = new HttpRequest('POST', 'api/anexo/upload', formData, this.httpOptions);

    const progress = new Subject<number>();
    const startTime = new Date().getTime();
    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round((100 * event.loaded) / event.total);
        progress.next(percentDone);
      } else if (event instanceof HttpResponse) {
        progress.complete();
      }
    });

    return progress.asObservable();
  }

  public async downloadFile(id: string): Promise<Blob> {
    const file =  await this.http.get<Blob>(
      '/api/anexo/get/' + id, this.httpOptionsFile).toPromise();
    return file;
  }

  getAll(): Observable<Anexo[]> {
    return this.http.get<Anexo[]>('/api/anexo/', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getByEmpresa(id): Observable<Anexo[]> {
    return this.http.get<Anexo[]>('/api/anexo/byempresa/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getByConta(id): Observable<Anexo[]> {
    return this.http.get<Anexo[]>('/api/anexo/byconta/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getByPagamento(id): Observable<Anexo[]> {
    return this.http.get<Anexo[]>('/api/anexo/bypagamento/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id): Observable<{}>{
    return this.http.delete('/api/anexo/' + id, this.httpOptions)
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
