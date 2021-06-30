const mongoose = require('mongoose');

const contaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: false
  },
  tipo: {
    type: Number,
    required: true
  },
  vencimento: {
    type: Date,
    required: false
  },
  alerta: {
    type: Number,
    required: false
  },
  status: {
    type: Number,
    required: false
  },
  objeto: {
    type: String,
    required: false
  },
  forma: {
    type: Number,
    requied: true
  },
  entrada: {
    type: Number,
    required: false
  },
  parcelas: {
    type: Number,
    required: false
  },
  valorparcelas: {
    type: Number,
    required: false
  },
  categoria: {
    type: String,
    required: false
  },
  empresa: {
    type: String,
    required: false
  },
  dataCriacao: {
    type: Date,
    requied: true
  },
  criadoPor: {
    type: String,
    required: true
  },
  fechadoPor: {
    type: String,
    required: false
  },
  fechadoEm: {
    type: Date,
    required: false
  }
}, {
  collection: 'contas'
})

mongoose.model('Conta', contaSchema);
