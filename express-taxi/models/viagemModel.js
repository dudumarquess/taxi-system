const mongoose = require('mongoose');
const haversine = require('haversine-distance');
const Schema = mongoose.Schema;

const ViagemSchema = new Schema({
    pedidoCliente: { 
        type: Schema.Types.ObjectId, 
        ref: 'PedidoCliente', 
        required: true 
    },
    turno: {
        type: Schema.Types.ObjectId,
        ref: 'Turno',
        required: true
    },
    numeroSequencia: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                // RIA 18: Número de sequência deve ser único no turno
                const existingViagem = await this.constructor.findOne({
                    turno: this.turno,
                    numeroSequencia: value,
                    _id: { $ne: this._id }
                });
                return !existingViagem;
            },
            message: 'Número de sequência já existe neste turno'
        }
    },
    inicio: {
        data: { type: Date, required: true }
    },
    fim: {
        data: { type: Date },
        morada: {
            rua: { type: String },
            cidade: { type: String },
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    quilometros: {
        type: Number,
        min: 0 // RIA 20: Quilômetros devem ser positivos
    },
    valorTotal: {
        type: Number,
        min: 0
    },
    numeroPessoas: {
        type: Number,
        required: true,
        min: [1, 'Mínimo de 1 pessoa'], // RIA 19
        max: [6, 'Máximo de 6 pessoas']
    }
});

// Método para calcular quilômetros usando Haversine
ViagemSchema.methods.calcularQuilometros = function() {
    const start = {
        lat: this.pedidoCliente.origem.lat,
        lng: this.pedidoCliente.origem.lng
    };
    const end = {
        lat: this.fim.morada.lat,
        lng: this.fim.morada.lng
    };

    return haversine(start, end) / 1000; // Converte metros para quilômetros
};

// Método para calcular preço
ViagemSchema.methods.calcularPreco = async function() {
    const preco = await mongoose.model('Preco').findOne({ 
        nivelConforto: this.pedidoCliente.nivelConforto 
    });

    if (!preco) throw new Error('Configuração de preço não encontrada');

    const duracao = (this.fim.data - this.inicio.data) / (1000 * 60); // duração em minutos
    const isNoturno = this.isHorarioNoturno();
    const precoBase = duracao * preco.precoPorMinuto;
    
    return isNoturno ? 
        precoBase * (1 + preco.acrescimoNoturno / 100) : 
        precoBase;
};

// Método auxiliar para verificar horário noturno
ViagemSchema.methods.isHorarioNoturno = function() {
    const hora = this.inicio.data.getHours();
    return hora >= 21 || hora < 6;
};

// Pre-save middleware para validações
ViagemSchema.pre('save', async function(next) {
    try {
        // Validar que início é anterior ao fim
        if (this.fim.data && this.inicio.data >= this.fim.data) {
            throw new Error('A data de início deve ser anterior à data de fim');
        }

        // Validar que o período da viagem está contido no turno (RIA 2)
        const turno = await mongoose.model('Turno').findById(this.turno);
        if (!turno || this.inicio.data < turno.inicio || this.fim.data > turno.fim) {
            throw new Error('O período da viagem deve estar contido no período do turno');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Viagem', ViagemSchema);