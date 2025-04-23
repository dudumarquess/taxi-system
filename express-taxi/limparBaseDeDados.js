// limparBaseDeDados.js
const mongoose = require('mongoose');

// Importa os modelos
const Motorista = require('./models/motoristaModel');
const Taxi = require('./models/taxiModel');
const Preco = require('./models/precoModel');

// ⚠️ Altere essa URI se necessário (ou use process.env.MONGODB_URI com dotenv)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparBaseDeDados() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    const motoristaResult = await Motorista.deleteMany({});
    const taxiResult = await Taxi.deleteMany({});
    const precoResult = await Preco.deleteMany({});

    console.log(`🚗 Motoristas removidos: ${motoristaResult.deletedCount}`);
    console.log(`🚕 Táxis removidos: ${taxiResult.deletedCount}`);
    console.log(`💰 Preços removidos: ${precoResult.deletedCount}`);

  } catch (err) {
    console.error('❌ Erro ao limpar a base de dados:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparBaseDeDados();
