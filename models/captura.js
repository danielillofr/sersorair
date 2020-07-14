const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const capturaSchema = new Schema({
    fechaInicio: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    comentario: {
        type: String,
        default: 'Sin comentarios'
    }
})

module.exports = mongoose.model('Captura', capturaSchema)