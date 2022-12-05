const PeticaoController = require('../controller/peticaoController');

module.exports = {
    getPeticaobyTitulo: (app) =>{
        console.log('Rota get Petição');
        app.get('/api/peticao/:titulo',PeticaoController.getPeticaoByTitulo);
    },
    getAllPeticoes: (app) =>{
        app.get('/api/peticoes',PeticaoController.getAllPeticoes);
    },
    incluirPeticao: (app) =>{
        console.log('Rota incluir Petição');
        app.post('/api/peticoes',PeticaoController.incluirPeticao);
    },
    apagarPeticao: (app) =>{
        console.log('Rota apagar Petição');
        app.delete('/api/peticoes/:id',PeticaoController.apagarPeticao);
    },
    alterarPeticao: (app) =>{
        console.log('Rota alterar petição');
        app.put('/api/alterarPeticao/:id',PeticaoController.alterarPeticao);
    },
    assinarPeticao: (app) =>{
        console.log('Rota assinar petição');
        app.post('/api/assinarPeticao',PeticaoController.assinarPeticao);
    },
    autenticarUsuario: (app) =>{
        console.log('Rota autenticar usuario');
        app.post('/api/autenticar',PeticaoController.autenticarUsuario);
    }
}