const Viagem = require('../models/viagemModel');

exports.estatisticaInicialMotorista = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    let { inicio, fim } = req.query;
    console.log('Motorista ID:', motoristaId);
    console.log('Início:', inicio);

    // Por padrão, usar o dia de hoje
    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      // Corrigido: strings para datas completas
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    // Buscar viagens concluídas do motorista no período
    const viagens = await Viagem.find({
      motorista: motoristaId,
      'fim.data': { $gte: inicio, $lte: fim }
    });

    const totalViagens = viagens.length;
    const totalHoras = viagens.reduce((acc, v) => {
      if (v.inicio.data && v.fim.data) {
        return acc + ((new Date(v.fim.data) - new Date(v.inicio.data)) / 3600000);
      }
      return acc;
    }, 0);
    const totalKm = viagens.reduce((acc, v) => acc + (v.quilometros || 0), 0);
    
    res.json({ totalViagens, totalHoras, totalKm });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.estatisticaInicialTaxi = async (req, res) => {
  try {
    const { taxiId } = req.params;
    let { inicio, fim } = req.query;

    console.log('Taxi ID:', taxiId);
    console.log('Data início:', inicio);
    console.log('Data fim:', fim);


    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      // Corrigido: strings para datas completas
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    
    // Buscar viagens concluídas desse táxi no período
    const viagensDoTaxi = await Viagem.find({
      'fim.data': { $gte: inicio, $lte: fim },
    })

    console.log('Viagens do táxi:', viagensDoTaxi);


    const totalViagens = viagensDoTaxi.length;
    const totalHoras = viagensDoTaxi.reduce((acc, v) => {
      if (v.inicio && v.fim && v.inicio.data && v.fim.data) {
        return acc + ((v.fim.data - v.inicio.data) / (1000 * 60 * 60));
      }
      return acc;
    }, 0);
    const totalKm = viagensDoTaxi.reduce((acc, v) => acc + (v.quilometros || 0), 0);

    res.json({
      taxiId,
      periodo: { inicio, fim },
      totais: {
        viagens: totalViagens,
        horas: Number(totalHoras.toFixed(2)),
        quilometros: Number(totalKm.toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};