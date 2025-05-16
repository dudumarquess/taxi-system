const mongoose = require('mongoose');

// Importa o modelo de Viagem
const Turno = require('./models/turnoModel');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://projeto_taxi:taxi_malucos@cluster0.vjbjhde.mongodb.net/taxis?retryWrites=true&w=majority&appName=Cluster0';

async function limparTurnos() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove todos os turnos
    const turnoResult = await Turno.deleteMany({});
    console.log(`🗑️ Turnos removidas: ${turnoResult.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro ao limpar as viagens:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

limparTurnos();