const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: false
  },
  valor: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: false
  },
  alerta: {
    type: Number,
    required: false
  },
  dataVencimento: {
    type: Date,
    required: true
  },
  dataPagamento: {
    type: Date,
    required: false
  },
  dataCriacao: {
    type: Date,
    requied: true
  },
  conta: {
    type: String,
    required: true
  },
  criadoPor: {
    type: String,
    required: true
  },
  pagoPor: {
    type: String,
    required: false
  }
}, {
  collection: 'pagamentos'
})

mongoose.model('Pagamento', pagamentoSchema);
