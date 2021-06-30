const mongoose = require('mongoose');
const { NotExtended } = require('http-errors');
const Pagamento = mongoose.model('Pagamento');
const Conta = mongoose.model('Conta');

const STANDARD_STATUS = {
  PAGO: 0,
  EM_HAVER: 1
}

const STANDARD_TYPE = {
  NORMAL : 0,
  MENSAL : 1,
  ANUAL : 2
}

function validateMessage(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'Unauthorized'
    });
    return false;
  } else {
    return true;
  }
}

module.exports.gerarPagamentos = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.findById({_id: req.body.conta}, function(err, conta) {
      if (err){
        console.log(err);
        res.send(err);
      } else {
        const vencimento = req.body.vencimento;
        const quantidade = req.body.quantidade;
        let erro = false;
        for (let i = 0; i < quantidade; i++) {
          const pagamento = new Pagamento();
          const numero = i + 1;
          pagamento.descricao = 'Parcela ' + numero;
          pagamento.valor = req.body.valor;
          pagamento.status = STANDARD_STATUS.EM_HAVER;
          pagamento.alerta = conta.alerta;
          pagamento.dataVencimento = new Date(req.body.vencimento);
          pagamento.dataVencimento = new Date(addMonths(pagamento.dataVencimento, i));
          //pagamento.dataVencimento.setMonth(pagamento.dataVencimento.getMonth() + i)
          pagamento.dataPagamento = null;
          pagamento.dataCriacao = Date.now();
          pagamento.conta = req.body.conta;
          pagamento.criadoPor = req.payload._id;
          pagamento.pagoPor = null;
          pagamento.save(function (err) {
            if (err) {
              erro = true;
            }
          });
        }
        if (erro) {
          res.status(404).json({ message: 'Erro' });
        } else {
          res.status(200).json({ message: 'Pagamento Criado!' });
        }
      }
    });
  }
}

module.exports.createPagamento = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.findById({_id: req.body.conta}, function(err, conta) {
      if (err){
        console.log(err);
        res.send(err);
      } else {
        const pagamento = new Pagamento();
        pagamento.descricao = req.body.descricao;
        pagamento.valor = req.body.valor;
        pagamento.status = STANDARD_STATUS.EM_HAVER;
        pagamento.alerta = conta.alerta;
        pagamento.dataVencimento = req.body.dataVencimento;
        pagamento.dataPagamento = null;
        pagamento.dataCriacao = Date.now();
        pagamento.conta = req.body.conta;
        pagamento.criadoPor = req.payload._id;
        pagamento.pagoPor = null;
        pagamento.save(function (err) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.status(200).json({ message: 'Pagamento Criado!' });
          }
        });
      }
    });
  };
};

module.exports.getTotalPagamentos = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Pagamento.find({});
    query.where('conta', req.params._id);
    query.exec(function (err, pagamentos) {
      if (err) {
        res.send(err);
      } else {
        let total = 0;
        pagamentos.forEach(pagamento => {
          total = total + pagamento.valor;
        });
        console.log(total);
        res.status(200).json(total);
      }
    });
  }
}

module.exports.getPagamentos = (req, res) => {
  if (validateMessage(req, res)) {
    Pagamento.find(function (err, pagamentos) {
      if (err)
        res.send(err);
      else
        res.status(200).json(pagamentos);
    });
  };
};

module.exports.getPagamentoById = (req, res) => {
  if (validateMessage(req, res)) {
    Pagamento.findById({ _id: req.params._id }, function (err, pagamento) {
      if (err)
        res.send(err);
      else
        res.status(200).json(pagamento);
    });
  };
};

module.exports.getPagamentosByConta = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Pagamento.find({});
    query.where('conta', req.params._id);
    query.exec(function (err, pagamentos) {
      if (err)
        res.send(err);
      else
        res.status(200).json(pagamentos);
    });
  }
}

function pagar(req, res) {
  Conta.findById({ _id: req.body.conta }, function (err, conta) {
    if (err) {
      res.send(err);
    } else {
      if (conta.tipo > 0) {
        // Conta Periodica
        console.log('Conta Periódica detectada...');
        atualizar(req,res);
        const pagamento = new Pagamento();
        pagamento.valor = conta.valor;
        pagamento.status = STANDARD_STATUS.EM_HAVER;
        pagamento.alerta = conta.alerta;
        pagamento.dataVencimento = conta.vencimento;
        if (conta.tipo === STANDARD_TYPE.MENSAL) {
          // Conta mensal
          console.log('Conta Mensal...');
          let newDate = new Date (pagamento.dataVencimento);
          pagamento.dataVencimento = new Date(addMonths(newDate,1));
          //pagamento.dataVencimento.setMonth(pagamento.dataVencimento.getMonth() + 1);
          pagamento.descricao = conta.descricao + ' - ' + getMonthString(pagamento.dataVencimento.getMonth());
        } else {
          // Conta anual
          console.log('Conta Anual...');
          pagamento.dataVencimento.setFullYear(pagamento.dataVencimento.getFullYear() + 1);
          pagamento.descricao = conta.descricao + ' - ' + pagamento.dataVencimento.getFullYear();
        }
        pagamento.dataPagamento = null;
        pagamento.dataCriacao = Date.now();
        pagamento.conta = conta._id;
        pagamento.criadoPor = req.payload._id;
        pagamento.pagoPor = null;
        console.log('Iniciando criação de novo pagamento...');
        pagamento.save(function (err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Pagamento automático Criado...');
            console.log('Atualizando data de vencimento da conta...');
            conta.vencimento = pagamento.dataVencimento;
            atualizarVencimentoConta(conta._id, conta.vencimento);
          };
        });
      } else {
        // Conta Normal
        console.log('Pagamento realizado - Conta Normal...')
        atualizar(req,res);

        var query = Pagamento.find({});
        query.where('conta', conta._id);
        query.exec(function (err, pagamentos) {
          if (err)
            console.log(err);
          else{
            let quitada = true;
            pagamentos.forEach(pag => {
              if (pag.status == STANDARD_STATUS.EM_HAVER) {
                quitada = false;
              }
            });
            if (quitada) {
              console.log("Totos pagamentos quitados detectados")
              conta.status = STANDARD_STATUS.PAGO;
              conta.save(function (err) {
                if (err){
                  console.log(err);
                } else {
                  console.log("Conta quitada!");
                }
              });
            }
          }
        });

      }
    }
  });
}

function atualizarVencimentoConta(id, data) {
  Conta.findByIdAndUpdate({_id: id},
    { vencimento : data },
    function(err, conta) {
    if (err){
      console.log(err);
    }
    else {
      console.log('Conta atualizada...');
      console.log('Término do pagamento...');
      console.log('********************************************************');
    }
  });
}

function atualizar(req, res) {
  Pagamento.findByIdAndUpdate({ _id: req.params._id },
    {
      descricao: req.body.descricao,
      valor: req.body.valor,
      status: req.body.status,
      alerta: req.body.alerta,
      dataVencimento: req.body.dataVencimento,
      dataPagamento: req.body.dataPagamento,
      pagoPor: req.body.pagoPor
    },
    function (err, pagamento) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log('Pagamento atualizado...')
        res.status(200).json({ message: 'Pagamento Atualizado!' });
      }
    });
}

module.exports.updatePagamento = (req, res) => {
  if (validateMessage(req, res)) {
    console.log('********************************************************');
    console.log('Início do Pagamento');
    Pagamento.findById({ _id: req.params._id }, function (err, pagamento) {
      if (err) {
        res.send(err);
      }
      else {
        if ((pagamento.status === STANDARD_STATUS.EM_HAVER) && (req.body.status === STANDARD_STATUS.PAGO)) {
          console.log('Detectado Pagamento...')
          // Foi deito um pagamento
          pagar(req, res);
        } else {
          // Foi apenas uma atualizacao sem alterar o status
          console.log('Atualização sem pagamento iniciada...')
          atualizar(req,res);
        }
      }
    });
  };
};

module.exports.deletePagamento = (req, res) => {
  if (validateMessage(req, res)) {
    Pagamento.remove({ _id: req.params._id }, function (err, bear) {
      if (err)
        res.send(err);
      else
        res.status(200).json({ message: 'Pagamento excluido com sucesso!' });
    });
  };
};

function addMonths(date, count) {
  if (date && count) {
    var m, d = (date = new Date(+date)).getDate()
    date.setMonth(date.getMonth() + count, 1)
    m = date.getMonth()
    date.setDate(d)
    if (date.getMonth() !== m) date.setDate(0)
  }
  return date
}

function getMonthString(month) {
  result: ''
  switch (month) {
    case 0: result = 'Janeiro';    
      break;
    case 1: result = 'Fevereiro';    
      break;
    case 2: result = 'Março';    
      break; 
    case 3: result = 'Abril';    
      break;
    case 4: result = 'Maio';    
      break;
    case 5: result = 'Junho';    
      break; 
    case 6: result = 'Julho';    
      break;
    case 7: result = 'Agosto';    
      break;
    case 8: result = 'Setembro';    
      break; 
    case 9: result = 'Outubro';    
      break;
    case 10: result = 'Novembro';    
      break;
    case 11: result = 'Dezembro';    
      break; 
    default: result = '';
      break;
  }
  return result;
}
