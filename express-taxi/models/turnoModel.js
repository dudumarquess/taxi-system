const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TurnoSchema = new Schema({
    motorista: { type: Schema.Types.ObjectId, ref: 'Motorista', required: true },
    taxi: { type: Schema.Types.ObjectId, ref: 'Taxi', required: true },
    inicio: { type: Date, required: true },
    fim: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Turno', TurnoSchema);