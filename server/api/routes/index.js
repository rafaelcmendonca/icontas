const ctrlAuth = require('../controllers/authentication');
const ctrlProfile = require('../controllers/profile');
const ctrlEmpresa = require('../controllers/empresa');
const ctrlCategoria = require('../controllers/categoria');
const ctrlConta = require('../controllers/conta');
const ctrlPagamento = require('../controllers/pagamento');
const ctrlAnexo = require('../controllers/anexo');
const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();

const auth = jwt({
  secret: 'my-secret-should-not-be-here', //My Secret
  userProperty: 'payload'
});

// profile
router.get('/profile', auth, ctrlProfile.profileRead); //Recebe o user que esta logado
router.get('/profile/user/:_id', auth, ctrlProfile.getUserById); //Recebe o user especificado pelo ID
router.post('/updPass', auth, ctrlProfile.updatePassword);

// categoria
router.post('/categoria/add', auth, ctrlCategoria.addCategoria);
router.get('/categoria', auth, ctrlCategoria.getCategorias);
router.get('/categoria/:_id', auth, ctrlCategoria.getCategoriaById);
router.put('/categoria/:_id', auth, ctrlCategoria.updateCategoria);
router.delete('/categoria/:_id', auth, ctrlCategoria.deleteCategoria);

// empresa
router.post('/empresa/add', auth, ctrlEmpresa.addEmpresa);
router.get('/empresa', auth, ctrlEmpresa.getEmpresas);
router.get('/empresa/:_id', auth, ctrlEmpresa.getEmpresaById);
router.put('/empresa/:_id', auth, ctrlEmpresa.updateEmpresa);
router.delete('/empresa/:_id', auth, ctrlEmpresa.deleteEmpresa);

// conta
router.post('/conta/add', auth, ctrlConta.createConta);
router.get('/conta', auth, ctrlConta.getContas);
router.get('/conta/:_id', auth, ctrlConta.getContaById);
router.get('/conta/byempresa/:_id', auth, ctrlConta.getContasByEmpresa)
router.put('/conta/:_id', auth, ctrlConta.updateConta);
router.delete('/conta/:_id', auth, ctrlConta.deleteConta);

// pagamento
router.post('/pagamento/add', auth, ctrlPagamento.createPagamento);
router.post('/pagamento/gerar', auth, ctrlPagamento.gerarPagamentos);
router.get('/pagamento/total/:_id', auth, ctrlPagamento.getTotalPagamentos);
router.get('/pagamento', auth, ctrlPagamento.getPagamentos);
router.get('/pagamento/:_id', auth, ctrlPagamento.getPagamentoById);
router.get('/pagamento/byconta/:_id', auth, ctrlPagamento.getPagamentosByConta);
router.put('/pagamento/:_id', auth, ctrlPagamento.updatePagamento);
router.delete('/pagamento/:_id', auth, ctrlPagamento.deletePagamento);

// anexo
router.get('/anexo', auth, ctrlAnexo.getaAnexos);
router.get('/anexo/:_id', auth, ctrlAnexo.getAnexoById);
router.get('/anexo/bypagamento/:_id', auth, ctrlAnexo.getAnexosByPagamento);
router.get('/anexo/byconta/:_id', auth, ctrlAnexo.getAnexosByConta);
router.get('/anexo/byempresa/:_id', auth, ctrlAnexo.getAnexosByEmpresa);
router.delete('/anexo/:_id', auth, ctrlAnexo.deleteAnexo);
router.post('/anexo/upload', auth, ctrlAnexo.uploadFile); // file upload
router.get('/anexo/get/:_id', auth, ctrlAnexo.downloadFile);

// authentication
router.post('/register', auth, ctrlAuth.register);
router.post('/login', ctrlAuth.login);




module.exports = router;
