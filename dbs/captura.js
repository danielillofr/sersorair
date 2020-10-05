const Captura = require('./../models/captura');
const Datos = require('./../models/datos');

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

Obtener_ultimo_elemento = (id) => {
    return new Promise((resolve,reject)=>{
        Datos.findOne({capturaID: id})
             .sort({fecha: -1})
             .exec((err, ultimo)=>{
                 if (err) {
                     reject (err)
                 }else{
                     resolve (ultimo)
                 }
             })
    })
}

Obtener_capturas_con_ultimo = async() => {
    try{
        capConUltimo = [];
        capturas = await Obtener_capturas();
        for (i=0; i < capturas.length; i++) {
            ultimo = await Obtener_ultimo_elemento(capturas[i]._id);
            console.log(ultimo);
            capConUltimo.push({
                captura: capturas[i],
                ultimo: (ultimo)?(ultimo):{fecha:'',pm25:''}
            })
        }
        return capConUltimo;
    }catch(error) {
        console.log(error)
        throw new Error(error);
    }

}


//Localiza un valor dentro del rango de valores, el del momento concreto
Localizar_valor_pm25 = (datos, momento) => {
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
        datos = await Obtener_captura(capturaID);
        valores = [];
        fechas = [];
        if (datos.length > 0)
        {
            if (fechaInicial)
            {
                fecha = new Date(Date.parse(fechaInicial));
            }else{
                fecha = new Date(Date.parse(datos[0].fecha));
            }
            if (fechaFinal) {
                fechaFin = new Date(Date.parse(fechaFinal));
            }else{
                fechaFin = new Date(Date.parse(datos[datos.length - 1].fecha));
            }
            if (!tiempo){
                if (datos.length < 500)
                {
                    tiempo = 1;
                }else{
                    auxT = fechaFin.getTime() - fecha.getTime();
                    tiempo = auxT / 500000;
                }
            }
            console.log(`${fecha}-${fechaFin} con tiempo ${tiempo}`)
            while (fecha < fechaFin) {
                valor = Localizar_valor_pm25(datos, fecha);
                valores.push(valor);
                fechas.push(`${fecha.getHours()}:${fecha.getMinutes()}`);
                fecha.setSeconds(fecha.getSeconds() + tiempo);
            }
            console.log('Fin del while:')
        }
        return {
            valores,
            fechas
        }
    }catch(error) {
        console.log(error)
        throw new Error(error);
    }
}

//Localiza un valor dentro del rango de valores, el del momento concreto
Localizar_valor_pm10 = (datos, momento) => {
    muestra = 0;
    if (momento > Date.parse(datos[datos.length - 1].fecha)) { //Si no hay muestras posteriores al momento, nos quedamos con la última
        return datos[datos.length - 1].pm10;
    }
    while(momento > Date.parse(datos[muestra].fecha))
    {
        muestra++;
    }
    if (muestra > 0) {
        return datos[muestra - 1].pm10;//LUEGO HAY QUE CAMBIAR ESTO A LA MUESTRA ANTERIOR

    }else{
        return datos[muestra].pm10;//No debe ocurrir nunca, ya que cogemos un día antes para evitar esto.
    }

}

Crear_array_10 = async(capturaID, fechaInicial, fechaFinal, tiempo) => {
    try {
        datos = await Obtener_captura(capturaID);
        if (fechaInicial)
        {
            fecha = new Date(Date.parse(fechaInicial));
        }else{
            fecha = new Date(Date.parse(datos[0].fecha));
        }
        if (fechaFinal) {
            fechaFin = new Date(Date.parse(fechaFinal));
        }else{
            fechaFin = new Date(Date.parse(datos[datos.length - 1].fecha));
        }
        if (!tiempo) tiempo=10;
        console.log(`${fecha}-${fechaFin}`)
        valores = [];
        fechas = [];
        while (fecha < fechaFin) {
            valor = Localizar_valor_pm10(datos, fecha);
            valores.push(valor);
            fechas.push(fecha);
            fecha.setSeconds(fecha.getSeconds() + tiempo);
        }
        console.log('Fin del while')
        return {
            valores,
            fechas
        }
    }catch(error) {
        throw new Error(error);
    }
}


module.exports = {Crear_captura,Obtener_capturas,Obtener_captura,Crear_array_25,Crear_array_10,Obtener_capturas_con_ultimo}