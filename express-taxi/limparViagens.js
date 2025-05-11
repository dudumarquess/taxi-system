const mongoose = require('mongoose');

// Importa o modelo de Viagem
const Viagem = require('./models/viagemModel');

// ⚠️ Altere essa URI se necessário (ou use process.env.MONGODB_URI com dotenv)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparViagens() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove todas as viagens
    const viagemResult = await Viagem.deleteMany({});
    console.log(`🗑️ Viagens removidas: ${viagemResult.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro ao limpar as viagens:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparViagens();