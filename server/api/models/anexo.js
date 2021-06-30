const mongoose = require('mongoose');

const anexoSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  idFile: {
    type: String
  },
  contentType: {
    type: String,
    required: false
  },
  fileName: {
    type: String,
    required: false
  },
  dataCriacao: {
    type: Date,
    requied: true
  },
  empresa: {
    type: String,
    required: false
  },
  conta: {
    type: String,
    required: false
  },
  pagamento: {
    type: String,
    required: false
  },
  criadoPor: {
    type: String,
    required: true
  }
}, {
  collection: 'anexo'
})

mongoose.model('Anexo', anexoSchema);
