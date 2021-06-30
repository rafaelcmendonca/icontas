require('../models/conta');

const mongoose = require('mongoose');
const { NotExtended } = require('http-errors');
const Conta = mongoose.model('Conta');
const Pagamento = mongoose.model('Pagamento');

const STANDARD_STATUS = {
  FECHADA: 0,
  ABERTA: 1,
}

const PAGAMENTO_STANDARD_STATUS = {
  PAGO: 0,
  EM_HAVER: 1
}

const STANDARD_TYPE = {
  NORMAL: 0,
  MENSAL: 1,
  ANUAL: 2
}

const STANDARD_OBJETO = {
  ORDINARIA: "0",
  SERVICO: "1",
  MATERIAL: "2"
}

const STANDARD_FORMA = {
  A_VISTA: 1,
  PARCELADO: 2
}

function validateMessage(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'Unauthorized'
    });
    console.log('Erro');
    return false;
  } else {
    return true;
  }
}

module.exports.createConta = (req, res) => {
  if (validateMessage(req, res)) {
    const conta = new Conta();
    conta.descricao = req.body.descricao;
    conta.tipo = req.body.tipo;
    conta.entrada = req.body.entrada;
    conta.parcelas = req.body.parcelas;
    conta.valorparcelas = req.body.valorparcelas;
    conta.forma = req.body.forma;
    if (conta.forma == STANDARD_FORMA.PARCELADO){
      conta.valor = conta.entrada + (conta.parcelas * conta.valorparcelas);
    } else {
      conta.valor = req.body.valor;
    }
    conta.vencimento = req.body.vencimento;
    if (conta.vencimento) {
      if (conta.vencimento.getDate() === 31) {
        conta.vencimento.setDate(30);
      }
    }
    conta.status = STANDARD_STATUS.ABERTA;
    conta.objeto = req.body.objeto;
    conta.alerta = req.body.alerta;
    conta.empresa = req.body.empresa;
    conta.categoria = req.body.categoria;
    conta.dataCriacao = Date.now();
    conta.criadoPor = req.payload._id;
    conta.fechadoPor = null;
    conta.fechadoEm = null;
    conta.save(function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (conta.tipo > 0) {
          const pagamento = new Pagamento();
          if (conta.tipo === STANDARD_TYPE.MENSAL) {
            pagamento.descricao = conta.descricao + ' - ' + getMonthString(conta.vencimento.getMonth());
          } else {
            pagamento.descricao = conta.descricao + ' - ' + conta.vencimento.getFullYear();
          }
          pagamento.valor = conta.valor;
          pagamento.status = PAGAMENTO_STANDARD_STATUS.EM_HAVER;
          pagamento.alerta = conta.alerta;
          pagamento.dataVencimento = conta.vencimento;
          pagamento.dataPagamento = null;
          pagamento.dataCriacao = Date.now();
          pagamento.conta = conta._id;
          pagamento.criadoPor = req.payload._id;
          pagamento.pagoPor = null;
          pagamento.save(function (err) {
            if (err) {
              console.log(err);
              res.send(err);
            }
            else
              res.status(200).json({ message: 'Conta Criada junto com primeiro pagamento!' });
          });
        } else {
          if (conta.forma == STANDARD_FORMA.PARCELADO) {
            const pagamento = new Pagamento();
            pagamento.descricao = 'Entrada';
            pagamento.valor = conta.entrada;
            pagamento.status = PAGAMENTO_STANDARD_STATUS.EM_HAVER;
            pagamento.alerta = conta.alerta;
            pagamento.dataVencimento = conta.vencimento;
            pagamento.dataPagamento = null;
            pagamento.dataCriacao = Date.now();
            pagamento.conta = conta._id;
            pagamento.criadoPor = req.payload._id;
            pagamento.pagoPor = null;
            pagamento.save(function (err) {
              if (err) {
                console.log(err);
                res.send(err);
              }
              else {
                let erro = false;
                for (let i = 0; i < conta.parcelas; i++) {
                  let pagamento = new Pagamento();
                  let numero = i + 1;
                  pagamento.descricao = 'Parcela ' + numero;
                  pagamento.valor = conta.valorparcelas;
                  pagamento.status = PAGAMENTO_STANDARD_STATUS.EM_HAVER;
                  pagamento.alerta = conta.alerta;

                  newVencimento = new Date(conta.vencimento);
                  pagamento.dataVencimento = new Date(addMonths(newVencimento, i + 1));

                  pagamento.dataPagamento = null;
                  pagamento.dataCriacao = Date.now();
                  pagamento.conta = conta._id;
                  pagamento.criadoPor = req.payload._id;
                  pagamento.pagoPor = null;
                  pagamento.save(function (err) {
                    if (err) {
                      erro = true;
                    }
                  });
                }
                if (erro) {
                  console.log(err);
                  res.status(404).json({ message: 'Erro' });
                } else {
                  res.status(200).json({ message: 'Conta, Entrada e Pagamentos Parcelados Criados!' });
                }
              }
            });
          } else {
            const pagamento = new Pagamento();
            pagamento.descricao = 'Parcela Única';
            pagamento.valor = conta.valor;
            pagamento.status = PAGAMENTO_STANDARD_STATUS.EM_HAVER;
            pagamento.alerta = conta.alerta;
            pagamento.dataVencimento = conta.vencimento;
            pagamento.dataPagamento = null;
            pagamento.dataCriacao = Date.now();
            pagamento.conta = conta._id;
            pagamento.criadoPor = req.payload._id;
            pagamento.pagoPor = null;
            pagamento.save(function (err) {
              if (err) {
                console.log(err);
                res.send(err);
              }
              else
                res.status(200).json({ message: 'Conta Criada junto com o pagamento!' });
            });
          }
        }
      }
    });
  };
};

module.exports.getContas = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.find(function (err, contas) {
      if (err)
        res.send(err);
      else
        res.status(200).json(contas);
    });
  };
};

module.exports.getContaById = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.findById({ _id: req.params._id }, function (err, conta) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.status(200).json(conta);
      }
    });
  };
};

module.exports.getContasByEmpresa = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Conta.find({});
    query.where('empresa', req.params._id);
    query.exec(function (err, contas) {
      if (err)
        res.send(err);
      else
        res.status(200).json(contas);
    });
  }
}

module.exports.updateConta = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.findByIdAndUpdate({ _id: req.params._id },
      {
        descricao: req.body.descricao,
        valor: req.body.valor,
        tipo: req.body.tipo,
        alerta: req.body.alerta,
        vencimento: req.body.vencimento,
        categoria: req.body.categoria,
        objeto: req.body.objeto,
        status: req.body.status,
        fechadoPor: req.body.fechadoPor,
        fechadoEm: req.body.fechadoEm
      },
      function (err, conta) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          res.status(200).json({ message: 'Conta Atualizada!' });
        }
      });
  };
};

module.exports.deleteConta = (req, res) => {
  if (validateMessage(req, res)) {
    Conta.remove({ _id: req.params._id }, function (err, bear) {
      if (err) {
        res.send(err);
      } else {
        Pagamento.deleteMany({ conta: req.params._id }, function (err, bear) {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            console.log('Conta e Pagamentos Excluidos');
            res.status(200).json({ message: 'Conta e Pagamentos excluidos com sucesso!' });
          }
        });
      }
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