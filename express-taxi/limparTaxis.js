const mongoose = require('mongoose');

// Importa o modelo de Viagem
const Taxi = require('./models/taxiModel');

// ⚠️ Altere essa URI se necessário (ou use process.env.MONGODB_URI com dotenv)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparTaxis() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove todas as viagens
    const taxiResult = await Taxi.deleteMany({});
    console.log(`🗑️ Taxis removidos: ${taxiResult.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro ao limpar as viagens:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparTaxis();