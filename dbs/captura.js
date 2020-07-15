const Captura = require('./../models/captura');
const Datos = require('./../models/datos')

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

Obtener_capturas = () => {
    return new Promise((resolve,reject) => {
        Captura.find({}, (err, capturas) => {
            if (err) {
                reject(err);
            }else{
                resolve(capturas)
            }
        })
    })
}

Obtener_captura = (id) => {
    return new Promise((resolve,reject)=>{
        Datos.find({capturaID: id}, (err, datos)=>{
            if (err) {
                reject(err);
            }else{
                resolve(datos)
            }
        })
    })
}

//Localiza un valor dentro del rango de valores, el del momento concreto
Localizar_valor = (datos, momento) => {
    muestra = 0;
    if (momento > Date.parse(datos[datos.length - 1].fecha)) { //Si no hay muestras posteriores al momento, nos quedamos con la última
        return datos[datos.length - 1].pm25;
    }
    while(momento > Date.parse(datos[muestra].fecha))
    {
        muestra++;
    }
    if (muestra > 0) {
        return datos[muestra - 1].pm25;//LUEGO HAY QUE CAMBIAR ESTO A LA MUESTRA ANTERIOR

    }else{
        return datos[muestra].pm25;//No debe ocurrir nunca, ya que cogemos un día antes para evitar esto.
    }

}

Crear_array_25 = async(capturaID, fechaInicial, fechaFinal, tiempo) => {
    try {
        datos = await Obtener_captura(capturaID)
        fecha = new Date(Date.parse(fechaInicial));
        fechaFin = new Date(Date.parse(fechaFinal));
        valores = [];
        while (fecha < fechaFin) {
            valor = Localizar_valor(datos, fecha);
            valores.push(valor);
            fecha.setSeconds(fecha.getSeconds() + tiempo);
        }
        return valores;
    }catch(error) {
        throw new Error(error);
    }
}

module.exports = {Crear_captura,Obtener_capturas,Obtener_captura,Crear_array_25}