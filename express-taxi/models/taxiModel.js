const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TaxiSchema = new Schema ({
    matricula: {type: String, required: true, unique: true},
    marca: {type: String, required: true},
    modelo: {type: String, required: true},
    ano_compra: {type: Number, required: true},
    nivel_conforto: {type: String, enum: {
            values: ['luxuoso', 'básico'],
            message: '{VALUE} não é um nível de conforto válido'
        }, required: true},
    quilometragem_total: {type: Number, required: false, min:[0, 'O valor deve ser positivo']},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    temTurno: {type: Boolean, default: false},
    temViagem: {type: Boolean, default: false}
});

TaxiSchema.virtual("url").get(function () {
    return `/taxi/${this._id}`;
});

module.exports = mongoose.model("Taxi", TaxiSchema);