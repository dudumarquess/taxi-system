const mongoose = require('mongoose');
const axios = require('axios');

const Schema = mongoose.Schema

const PedidoClienteSchema = new Schema({
    cliente: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true},

    origem: {
        rua: { type: String, required: true },
        cidade: { type: String, required: true },
        lat: { type: Number, required: false },
        lng: { type: Number, required: false }
    },
    destino: {
        rua: { type: String, required: true },
        cidade: { type: String, required: true },
        lat: { type: Number, required: false },
        lng: { type: Number, required: false }
    },
    nivelConforto: {
        type: String,
        enum: ['básico', 'luxuoso'],
        required: true
    },
    numeroPessoas: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    status: {
        type: String,
        enum: ['pendente_motorista', 'cancelado', 'pendente_cliente', 'rejeitado_pelo_cliente','aceito_pelo_cliente', 'em_viagem', 'concluído'],
        default: 'pendente_motorista'
    },
    motorista: {
        type: String,
    },
    distancia: {
        type: Number,
        required: false
    },
    dataPedido: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('PedidoCliente', PedidoClienteSchema);