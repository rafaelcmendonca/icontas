const mongoose = require('mongoose');
const { NotExtended } = require('http-errors');
const Anexo = mongoose.model('Anexo');
const IncomingForm = require('formidable').IncomingForm
var Grid = require('gridfs-stream');
var fs = require('fs');
const { Console } = require('console');

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

module.exports.getAnexoById = (req, res) => {
  if (validateMessage(req, res)) {
    Anexo.findById({ _id: req.params._id }, function (err, anexo) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(anexo);
      }
    });
  };
};

module.exports.getaAnexos = (req, res) => {
  if (validateMessage(req, res)) {
    Anexo.find(function (err, anexo) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(anexo);
      }
    });
  };
};

module.exports.getAnexosByConta = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Anexo.find({});
    query.where('conta', req.params._id);
    query.exec(function (err, anexos) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(anexos);
      }
    });
  }
}

module.exports.getAnexosByPagamento = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Anexo.find({});
    query.where('pagamento', req.params._id);
    query.exec(function (err, anexos) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(anexos);
      }
    });
  }
}

module.exports.getAnexosByEmpresa = (req, res) => {
  if (validateMessage(req, res)) {
    var query = Anexo.find({});
    query.where('empresa', req.params._id);
    query.exec(function (err, anexos) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(anexos);
      }
    });
  }
}

module.exports.deleteAnexo = (req, res) => {
  if (validateMessage(req, res)) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);
    Anexo.findById({ _id: req.params._id }, function (err, anexo) {
      if (err) {
        res.send(err);
      } else {
        console.log("Anexo encontrado");
        console.log('Tentando apagar: ' + anexo.idFile);
        gfs.remove({ _id: mongoose.mongo.ObjectID(anexo.idFile) }, (err, data) => {
          if (err) {
            res.send(err);
          } else {
            console.log("Arquivo " + anexo.fileName + ' Apagado!');
            Anexo.remove({ _id: req.params._id }, function (err, bear) {
              if (err) {
                res.send(err);
              } else {
                console.log('Anexo excluido');
                res.status(200).json({ message: 'Anexo excluido com sucesso!' });
              }
            });
          }
        });
      }
    });
  };
}

module.exports.downloadFile = (req, res) => {
  if (validateMessage(req, res)) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);
    console.log('Id recebido:' + req.params._id);

    var query = Anexo.find({});
    query.where('idFile', req.params._id);
    query.exec(function (err, anexos) {
      if (err) {
        res.send(err);
      } else {
        res.set('Content-Type', anexos[0].contentType);
        res.set('Content-Disposition', "inline; filename=" + anexos[0].fileName);

        var readstream = gfs.createReadStream({
          _id: mongoose.mongo.ObjectID(req.params._id)
        });
        readstream.pipe(res);
      }
    });
  }
}

module.exports.uploadFile = (req, res) => {
  var filePath = '';
  var fileType = '';
  var fileName = '';

  if (validateMessage(req, res)) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);
    var form = new IncomingForm()
    var anexo = new Anexo();

    form.on('file', (field, file) => {
      if (file) {
        anexo.fileName = file.name;
        anexo.contentType = file.type;
        filePath = file.path;
        fileType = file.type;
        fileName = file.name;
      }
    })

    form.on('field', function (name, field) {
      if (name === 'descricao') { anexo.descricao = field; }
      if (name === 'empresa') { anexo.empresa = field; }
      if (name === 'conta') { anexo.conta = field; }
      if (name === 'pagamento') { anexo.pagamento = field; }
    })


    form.on('end', () => {
      anexo.criadoPor = req.payload._id
      anexo.dataCriacao = Date.now();

      var read_stream = fs.createReadStream(filePath);
      var writestream = gfs.createWriteStream({
        'filename': fileName,
        mode: 'w',
        content_type: fileType
      });
      writestream.on('close', function (file) {
        fs.unlinkSync(filePath);
        anexo.idFile = file._id;
        console.log('Trying to save file: ' + anexo.fileName);
        anexo.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            res.status(200).json({ message: 'Anexo Salvo!' });
            console.log('Salvo');
          }
        });
      });
      read_stream.pipe(writestream);
    })
    form.parse(req)
  }
}

