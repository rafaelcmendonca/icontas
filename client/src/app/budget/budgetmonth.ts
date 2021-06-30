
export class BudgetMonthItem {
  empresa: string;
  conta: string;
  data: Date;
  valor: number;
  observacoes: string;

  constructor(){}
}

export class BudgetMonth {
  mes: string;
  ano: string;
  items: BudgetMonthItem[];
  receitas: number;
  despesas: number;
  reserva: number;

  constructor(){
    this.items = [];
    this.despesas = 0;
    this.receitas = 0;
  }
}
