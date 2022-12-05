const app = require('./config/server');
const routes = require('./routes/routes');

routes.getPeticaobyTitulo(app);
routes.alterarPeticao(app);
routes.apagarPeticao(app);
routes.incluirPeticao(app);
routes.autenticarUsuario(app);
routes.assinarPeticao(app);
routes.getAllPeticoes(app);

module.exports = app;