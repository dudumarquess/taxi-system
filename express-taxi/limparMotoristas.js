const mongoose = require('mongoose');

const Motorista = require('./models/motoristaModel');

// ⚠️ Altere essa URI se necessário (ou use process.env.MONGODB_URI com dotenv)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparMotoristas() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove todos os clientes
    const motoristaResult = await Motorista.deleteMany({});
    console.log(`🗑️ Motoristas removidos: ${motoristaResult.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro ao limpar os dados:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparMotoristas();