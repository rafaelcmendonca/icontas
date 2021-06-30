import { Component, OnInit } from '@angular/core';
import { PagamentoService } from '../pagamento/pagamento.service';
import { Pagamento } from '../pagamento/pagamento';

export class RosquinhaStruct {
  nome: string;
  valor: number;
  constructor() { }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pagamentos: Pagamento[] = [];
  atrasados: number;
  aVencer: number;

  constructor(
    public pagamentoService: PagamentoService
  ) {}


  ngOnInit(): void {
    this.pagamentoService.getAll().subscribe((data: Pagamento[]) => {
      this.pagamentos = data;
      this.checkAtrasados();
    });
    //localStorage.setItem("idCategoriaIRPF",null);
    const hoje = new Date();
    localStorage.setItem("anoBaseIRPF", (hoje.getFullYear() - 1).toString()); //Ano Base Padrão
  }

  checkAtrasados(): void {
    this.aVencer = 0;
    this.atrasados = 0;
    this.pagamentos.forEach(pagamento => {
      const hoje = new Date();
      const vencimento = new Date(pagamento.dataVencimento);
      if ((hoje > vencimento) && (pagamento.status)) {
        this.atrasados ++;
      } else {
        const alerta = new Date();
        alerta.setDate(alerta.getDate() + pagamento.alerta);
        if ((alerta > vencimento) && (pagamento.status)) {
          this.aVencer ++;
        }
      }
    });

  }

}
