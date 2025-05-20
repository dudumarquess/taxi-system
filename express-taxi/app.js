const express = require('express');
const mongoose = require('mongoose');
const taxiRouter = require('./routes/taxiRoutes');
const motoristaRoutes = require('./routes/motoristaRoutes');
const precoRoutes = require('./routes/precoRoutes');
const localidadeRoutes = require('./routes/localidadeRoutes');
const turnoRoutes = require('./routes/turnosRoutes');
const pedidoClienteRoutes = require('./routes/pedidoClienteRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
let cors = require('cors');
var logger = require('morgan');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/taxis', taxiRouter);
app.use('/motoristas', motoristaRoutes);
app.use('/precos', precoRoutes);
app.use('/localidade', localidadeRoutes);
app.use('/turnos', turnoRoutes);
app.use('/api/pedidoCliente', pedidoClienteRoutes);
app.use('/motorista/pedidos', require('./routes/pedidoMotoristaRoutes'));
app.use('/viagens', require('./routes/viagemRoutes'));
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/motoristas/:motoristaId', relatorioRoutes);
app.use('/taxis/:taxiId', relatorioRoutes);


//conexão com o mongoDB
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('Conectado ao MongoDB Atlas com sucesso');
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

module.exports = app;
