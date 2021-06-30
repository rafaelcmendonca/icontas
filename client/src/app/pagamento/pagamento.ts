export class Pagamento {
  _id: string;
  descricao: string;
  valor: number;
  status: number;
  alerta: number;
  dataVencimento: Date;
  dataPagamento: Date;
  dataCriacao: Date;
  conta: string;
  criadoPor: string;
  pagoPor: string;
  constructor(){}
}

export class PagamentoData {
  _id: string;
  categoria: string;
  empresa: string;
  conta: string;
  alerta: number;
  vencimento: Date;
  pagamento: Date;
  valor: number;
  status: number;
  descricao: string;
  constructor(){}
}
