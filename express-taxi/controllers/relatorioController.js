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
    const viagens = await Viagem.find({
      'fim.data': { $gte: inicio, $lte: fim },
    }).populate({
        path: 'turno',
        match: { taxi: taxiId }
      });


    // Filtrar apenas viagens cujo turno corresponde ao taxiId
    const viagensDoTaxi = viagens.filter(v => v.turno);

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

exports.subtotaisViagensPorMotoristaNoTaxi = async (req, res) => {
  try {
    const { taxiId } = req.params;
    let { inicio, fim } = req.query;

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

    // Agrupar por motorista (contar viagens)
    const viagensPorMotorista = {};
    viagensDoTaxi.forEach(v => {
      const id = v.motorista.toString();
      if (!viagensPorMotorista[id]) viagensPorMotorista[id] = 0;
      viagensPorMotorista[id] += 1;
    });

    // Buscar nomes dos motoristas
    const Motorista = require('../models/motoristaModel');
    const lista = await Promise.all(Object.entries(viagensPorMotorista).map(async ([id, total]) => {
      const m = await Motorista.findById(id);
      return { motoristaId: id, nome: m ? m.nome : 'Desconhecido', viagens: total };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.viagens - a.viagens);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subtotaisKmPorMotoristaNoTaxi = async (req, res) => {
  try {
    const { taxiId } = req.params;
    let { inicio, fim } = req.query;

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

    // Agrupar por motorista (somar km)
    const kmPorMotorista = {};
    viagensDoTaxi.forEach(v => {
      const id = v.motorista.toString();
      const km = v.quilometros || 0;
      if (!kmPorMotorista[id]) kmPorMotorista[id] = 0;
      kmPorMotorista[id] += km;
    });

    // Buscar nomes dos motoristas
    const Motorista = require('../models/motoristaModel');
    const lista = await Promise.all(Object.entries(kmPorMotorista).map(async ([id, km]) => {
      const m = await Motorista.findById(id);
      return { motoristaId: id, nome: m ? m.nome : 'Desconhecido', quilometros: Number(km.toFixed(2)) };
    }));

    // Ordenar decrescente
    lista.sort((a, b) => b.quilometros - a.quilometros);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};