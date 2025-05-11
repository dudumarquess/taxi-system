const mongoose = require('mongoose');

// Importa os modelos
const Cliente = require('./models/clienteModel');
const PedidoCliente = require('./models/pedidoClienteModel');
const Viagem = require('./models/viagemModel');

// ⚠️ Altere essa URI se necessário (ou use process.env.MONGODB_URI com dotenv)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparDados() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove todos os clientes
    const clienteResult = await Cliente.deleteMany({});
    console.log(`🗑️ Clientes removidos: ${clienteResult.deletedCount}`);

    // Remove todos os pedidos de clientes
    const pedidoClienteResult = await PedidoCliente.deleteMany({});
    console.log(`🗑️ Pedidos de clientes removidos: ${pedidoClienteResult.deletedCount}`);

    // Remove todas as viagens
    const viagemResult = await Viagem.deleteMany({});
    console.log(`🗑️ Viagens removidas: ${viagemResult.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro ao limpar os dados:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparDados();