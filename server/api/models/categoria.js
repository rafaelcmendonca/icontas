const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
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
  collection: 'categoria'
})

mongoose.model('Categoria', categoriaSchema);
