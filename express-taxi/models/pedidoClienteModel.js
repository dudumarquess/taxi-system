const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PedidoClienteSchema = new Schema({
    cliente: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true},

    origem: {
        rua: { type: String, required: true },
        cidade: { type: String, required: true }
    },
    destino: {
        rua: { type: String, required: true },
        cidade: { type: String, required: true }
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
        max: 7
    },
    status: {
        type: String,
        enum: ['pendente', 'em andamento', 'concluído', 'cancelado'],
        default: 'pendente'
    },
    dataPedido: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('PedidoCliente', PedidoClienteSchema);