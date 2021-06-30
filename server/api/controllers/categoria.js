const mongoose = require('mongoose');
const { NotExtended, Unauthorized } = require('http-errors');
const Categoria = mongoose.model('Categoria');
const Conta = mongoose.model('Conta');
const Pagamento = mongoose.model('Pagamento');

function validateMessage(req, res){
  if (!req.payload._id) {
    res.status(401).json({
      message: 'Unauthorized'
    });
    return false;
  } else {
    return true;
  }
}

module.exports.addCategoria = (req, res) => {
  if (validateMessage(req,res)) {
    const categoria = new Categoria();
    categoria.nome = req.body.nome;
    categoria.descricao = req.body.descricao;
    categoria.dataCriacao = Date.now();
    categoria.criadoPor = req.payload._id;
    categoria.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({message: 'Categoria Criada!'});
      }
    });
  };
};

module.exports.getCategorias = (req, res) => {
  if (validateMessage(req,res)) {
      Categoria.find(function(err, categorias) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json(categorias);
        }
    });
  };
};

module.exports.getCategoriaById = (req, res) => {
  if (validateMessage(req,res)) {
    Categoria.findById({_id: req.params._id}, function(err, categoria) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(categoria);
      }
  });
  };
};

module.exports.updateCategoria = (req, res) => {
  if (validateMessage(req,res)) {
    Categoria.findByIdAndUpdate({_id: req.params._id},
      { nome: req.body.nome,
        descricao: req.body.descricao
      },
      function(err, categoria) {
      if (err){
        console.log(err);
        res.send(err);
      }
      else {
        res.status(200).json({message: 'Categoria Alterada!'});
      }
    });
  };
};

function deleteContasByCategoria(idCategoria){
  var query = Conta.find({});
  query.where('categoria', idCategoria);
  query.exec(function (err, contas) {
    if (err) {
      res.send(err);
    } else {
      contas.forEach(function(conta) {
        Pagamento.deleteMany({conta: conta._id}, function(err, bear) {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            Conta.remove({_id: conta._id}, function(err, bear) {
              if (err)
                console.log(err);
              else
                console.log("Conta excluida");
            })
            console.log('Pagamentos Excluidos');
          }
        });
      })
    }
  });
}

module.exports.deleteCategoria = (req, res) => {
  if (validateMessage(req,res)) {
    Categoria.remove({_id: req.params._id}, function(err, bear) {
      if (err) {
          res.send(err);
      } else {
        deleteContasByCategoria(req.params._id);
        console.log('Categoria excluida');
        res.status(200).json({message: 'Categoria excluida com sucesso!'});
      }
  });
  };
};