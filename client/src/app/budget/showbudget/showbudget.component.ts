import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { Conta } from 'src/app/conta/conta';
import { ContaService } from 'src/app/conta/conta.service';
import { Empresa } from 'src/app/empresa/empresa';
import { EmpresaService } from 'src/app/empresa/empresa.service';
import { Pagamento } from 'src/app/pagamento/pagamento';
import { PagamentoService } from 'src/app/pagamento/pagamento.service';
import { BudgetMonth, BudgetMonthItem } from '../budgetmonth'

@Component({
  selector: 'app-showbudget',
  templateUrl: './showbudget.component.html',
  styleUrls: ['./showbudget.component.css']
})
export class ShowbudgetComponent implements OnInit {
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentosFiltrados: Pagamento[] = [];
  pagamentos: Pagamento[] = [];
  categorias: Categoria[] = [];
  salarioLiquido: number = 0;
  despesasMensais: number = 0;
  investimento: number = 0;
  meses: number = 0;
  budgetMonths: BudgetMonth[] = [];

  constructor(
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
    public categoriaService: CategoriaService,
    public contaService: ContaService,
  ) { }

  ngOnInit(): void {
    this.meses = 12;
    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
          });
        });
      });
    });
  }

  preparaDados(): void {
    this.budgetMonths = [];
    let today = new Date();
    let banco = this.investimento;
    for (let i = 0; i < this.meses; i++) {
      this.pagamentosFiltrados = this.pagamentos.filter(pagamento => (
        new Date(pagamento.dataVencimento).getMonth() === today.getMonth()) && (
          new Date(pagamento.dataVencimento).getFullYear() === today.getFullYear()) );

      this.pagamentosFiltrados = this.pagamentosFiltrados.filter(pagamento => pagamento.status == this.pagamentoService.STANDARD_STATUS.EM_HAVER );

      let bud = new BudgetMonth();
      // Salario
      let item = new BudgetMonthItem();
      item.empresa = "Salário";
      item.conta = "Salário";
      item.data = today;
      item.observacoes = "Salário";
      item.valor = this.salarioLiquido;
      bud.items.push(item);
      // Pagamentos
      this.pagamentosFiltrados.forEach(pagamento => {
        let itemP = new BudgetMonthItem();
        itemP.empresa = this.getEmpresaName(pagamento.conta);
        itemP.conta = this.getConta(pagamento.conta).descricao;
        itemP.data = pagamento.dataVencimento;
        itemP.observacoes = pagamento.descricao;
        itemP.valor = -pagamento.valor;
        bud.despesas += pagamento.valor;
        bud.items.push(itemP);
      });
      // Despesas Fixas
      item = new BudgetMonthItem();
      item.empresa = "Despesas Fixas Mensais";
      item.conta = "Despesas Fixas Mensais";
      item.data = today;
      item.observacoes = "Despesas Fixas Mensais";
      item.valor = this.despesasMensais;
      bud.items.push(item);

      bud.despesas += this.despesasMensais;
      bud.receitas = this.salarioLiquido;
      banco = banco + bud.receitas - bud.despesas;
      bud.reserva = banco;
      bud.mes = this.getMonthString(today.getMonth());
      bud.ano = String(today.getFullYear());
      this.budgetMonths.push(bud);
      today = new Date(this.addMonths(today, 1));
    }
  }

  addMonths(date, count) {
    if (date && count) {
      var m, d = (date = new Date(+date)).getDate()
      date.setMonth(date.getMonth() + count, 1)
      m = date.getMonth()
      date.setDate(d)
      if (date.getMonth() !== m) date.setDate(0)
    }
    return date
  }

  getEmpresaName(idConta): string {
    const idEmpresa = this.contas.find(conta => conta._id === idConta).empresa;
    return this.empresas.find(empresa => empresa._id === idEmpresa).nome;
  }

  getConta(id): any {
    return this.contas.find(conta => conta._id === id);
  }

  getMonthString(month): string {
    switch (month) {
      case 0: return 'Janeiro';
      case 1: return 'Fevereiro';
      case 2: return 'Março';
      case 3: return 'Abril';
      case 4: return 'Maio';
      case 5: return 'Junho';
      case 6: return 'Julho';
      case 7: return 'Agosto';
      case 8: return 'Setembro';
      case 9: return 'Outubro';
      case 10: return 'Novembro';
      case 11: return 'Dezembro';
      default: return '';
    }
  }

}
