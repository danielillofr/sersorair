const Datos = require('./../models/datos')

Crear_muestra = (datosRecibidos) => {
    return new Promise((resolve,reject)=>{
        let datos = new Datos({
            capturaID: datosRecibidos.capturaID,
            fecha: datosRecibidos.fecha,
            pm25: datosRecibidos.pm25,
            pm10: datosRecibidos.pm10
        })
        datos.save((err, datoGrabado) => {
            if (err) {
                reject(err);
            }else{
                resolve(true);
            }
        })
    })
}

module.exports = {Crear_muestra}
