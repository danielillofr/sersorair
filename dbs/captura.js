const Captura = require('./../models/captura');

Crear_captura = (comentario) => {
    fecha = new Date();
    console.log('A crear captura')
    return new Promise((resolve,reject)=>{
        let captura = new Captura({
            fechaInicio: fecha,
            comentario
        })
        console.log('A garudarla:', captura)
        captura.save((error, capturaGuardada) => {
            if (error) {
                reject(error)
            }else{
                console.log(capturaGuardada)
                resolve(capturaGuardada._id);
            }
        })
    })

}

module.exports = {Crear_captura}