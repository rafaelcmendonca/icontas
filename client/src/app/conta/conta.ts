
export class Conta {
  _id: string;
  descricao: string;
  valor: number;

  tipo: number;
  objeto: string;

  forma: number;
  entrada: number;
  parcelas: number;
  valorparcelas: number;

  vencimento: Date; // Só é usado se for periódica ou se for parcelado
  alerta: number; // Dias antes para alertar (só é usado se for conta periodica para passar para o pagamento)
  status: number;
  categoria: string;
  empresa: string;
  dataCriacao: Date;
  criadoPor: string;
  fechadoPor: string;
  fechadoEm: Date;
  constructor(){}

}
