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

exports.subtotaisHorasPorMotoristaNoTaxi = async (req, res) => {
  try {
    const { taxiId } = req.params;
    let { inicio, fim } = req.query;

    // Mesma lógica de datas dos outros métodos
    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    // Buscar viagens do taxi no período
    const viagens = await Viagem.find({
      'fim.data': { $gte: inicio, $lte: fim }
    }).populate('turno');

    // Filtrar viagens do taxi
    const viagensDoTaxi = viagens.filter(v => v.turno && v.turno.taxi.toString() === taxiId);

    // Agrupar por motorista
    const horasPorMotorista = {};
    viagensDoTaxi.forEach(v => {
      const id = v.motorista.toString();
      const horas = (v.inicio && v.fim && v.inicio.data && v.fim.data)
        ? (new Date(v.fim.data) - new Date(v.inicio.data)) / 3600000
        : 0;
      if (!horasPorMotorista[id]) horasPorMotorista[id] = 0;
      horasPorMotorista[id] += horas;
    });

    // Buscar nomes dos motoristas
    const Motorista = require('../models/motoristaModel');
    const lista = await Promise.all(Object.entries(horasPorMotorista).map(async ([id, horas]) => {
      const m = await Motorista.findById(id);
      return { motoristaId: id, nome: m ? m.nome : 'Desconhecido', horas: Number(horas.toFixed(2)) };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.horas - a.horas);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subtotaisHorasPorTaxiDoMotorista = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    console.log('Motorista ID:', motoristaId);
    let { inicio, fim } = req.query;

    // Mesma lógica de datas dos outros métodos
    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    // Buscar viagens do motorista no período
    const viagens = await Viagem.find({
      motorista: motoristaId,
      'fim.data': { $gte: inicio, $lte: fim }
    }).populate('turno');

    // Agrupar por táxi
    const horasPorTaxi = {};
    viagens.forEach(v => {
      const taxiId = v.turno && v.turno.taxi ? v.turno.taxi.toString() : null;
      if (!taxiId) return;
      const horas = (v.inicio && v.fim && v.inicio.data && v.fim.data)
        ? (new Date(v.fim.data) - new Date(v.inicio.data)) / 3600000
        : 0;
      if (!horasPorTaxi[taxiId]) horasPorTaxi[taxiId] = 0;
      horasPorTaxi[taxiId] += horas;
    });

    // Buscar dados dos táxis
    const Taxi = require('../models/taxiModel');
    const lista = await Promise.all(Object.entries(horasPorTaxi).map(async ([id, horas]) => {
      const t = await Taxi.findById(id);
      return { taxiId: id, matricula: t ? t.matricula : 'Desconhecido', horas: Number(horas.toFixed(2)) };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.horas - a.horas);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subtotaisViagensPorTaxiDoMotorista = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    let { inicio, fim } = req.query;
    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    const viagens = await Viagem.find({
      motorista: motoristaId,
      'fim.data': { $gte: inicio, $lte: fim }
    }).populate('turno');

    // Agrupar por táxi
    const viagensPorTaxi = {};
    viagens.forEach(v => {
      const taxiId = v.turno && v.turno.taxi ? v.turno.taxi.toString() : null;
      if (!taxiId) return;
      if (!viagensPorTaxi[taxiId]) viagensPorTaxi[taxiId] = 0;
      viagensPorTaxi[taxiId] += 1;
    });

    // Buscar dados dos táxis
    const Taxi = require('../models/taxiModel');
    const lista = await Promise.all(Object.entries(viagensPorTaxi).map(async ([id, viagens]) => {
      const t = await Taxi.findById(id);
      return { taxiId: id, matricula: t ? t.matricula : 'Desconhecido', viagens };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.viagens - a.viagens);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subtotaisKmPorTaxiDoMotorista = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    let { inicio, fim } = req.query;
    const hoje = new Date();
    if (!inicio || !fim) {
      inicio = new Date(hoje.setHours(0,0,0,0));
      fim = new Date(hoje.setHours(23,59,59,999));
    } else {
      inicio = new Date(inicio + 'T00:00:00');
      fim = new Date(fim + 'T23:59:59');
    }

    const viagens = await Viagem.find({
      motorista: motoristaId,
      'fim.data': { $gte: inicio, $lte: fim }
    }).populate('turno');

    // Agrupar por táxi
    const kmPorTaxi = {};
    viagens.forEach(v => {
      const taxiId = v.turno && v.turno.taxi ? v.turno.taxi.toString() : null;
      if (!taxiId) return;
      const km = v.quilometros || 0;
      if (!kmPorTaxi[taxiId]) kmPorTaxi[taxiId] = 0;
      kmPorTaxi[taxiId] += km;
    });

    // Buscar dados dos táxis
    const Taxi = require('../models/taxiModel');
    const lista = await Promise.all(Object.entries(kmPorTaxi).map(async ([id, quilometros]) => {
      const t = await Taxi.findById(id);
      return { taxiId: id, matricula: t ? t.matricula : 'Desconhecido', quilometros: Number(quilometros.toFixed(2)) };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.quilometros - a.quilometros);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

