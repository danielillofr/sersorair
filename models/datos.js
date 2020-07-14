const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datosSchema = new Schema({
    capturaID: {
        type: Schema.Types.ObjectId,
        req: 'Captura'
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    pm25: {
        type: String,
        required: [true, 'PM2.5 Obligatorio']
    },
    pm10: {
        type: String,
        require: [true, 'PM10 Obligatorio']
    }
})

module.exports = mongoose.model('Datos', datosSchema)