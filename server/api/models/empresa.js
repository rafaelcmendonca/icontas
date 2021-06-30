const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cpf: {
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
  }
}, {
  collection: 'empresas'
})

mongoose.model('Empresa', empresaSchema);
