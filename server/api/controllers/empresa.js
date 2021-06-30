const mongoose = require('mongoose');
const { NotExtended, Unauthorized } = require('http-errors');
const Empresa = mongoose.model('Empresa');
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

module.exports.addEmpresa = (req, res) => {
  if (validateMessage(req,res)) {
    const empresa = new Empresa();
    empresa.nome = req.body.nome;
    empresa.cpf = req.body.cpf;
    empresa.dataCriacao = Date.now();
    empresa.criadoPor = req.payload._id;
    empresa.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({message: 'Empresa Criada!'});
      }
    });
  };
};

module.exports.getEmpresas = (req, res) => {
  if (validateMessage(req,res)) {
      Empresa.find(function(err, empresas) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json(empresas);
        }
    });
  };
};

module.exports.getEmpresaById = (req, res) => {
  if (validateMessage(req,res)) {
    Empresa.findById({_id: req.params._id}, function(err, empresa) {
      if (err){
        res.send(err);
      } else {
        res.status(200).json(empresa);
      }
  });
  };
};

module.exports.updateEmpresa = (req, res) => {
  if (validateMessage(req,res)) {
    Empresa.findByIdAndUpdate({_id: req.params._id},
      { nome: req.body.nome,
        cpf: req.body.cpf
      },
      function(err, empresa) {
      if (err){
        console.log(err);
        res.send(err);
      } else {
        res.status(200).json({message: 'Empresa Alterada!'});
      }
    });
  };
};

function deleteContasByEmpresa(idEmpresa){
  var query = Conta.find({});
  query.where('empresa', idEmpresa);
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

module.exports.deleteEmpresa = (req, res) => {
  if (validateMessage(req,res)) {
    Empresa.remove({_id: req.params._id}, function(err, bear) {
      if (err) {
          res.send(err);
      } else {
        deleteContasByEmpresa(req.params._id);
        console.log('Empresa excluida');
        res.status(200).json({message: 'Empresa excluida com sucesso!'});
      }
  });
  };
};