const config = require('./config/config')
serialport = require ('serialport')
datosDBs = require('./dbs/datos')
const mongoose = require('mongoose');

const capturaDBs = require ('./dbs/captura')

if (process.argv.length < 3) {
    console.log('Indique un comentario (sin espacios)')
    return;
}



Conectar_base_datos = (urlDb) => {
    return new Promise ((resolve,reject) => {
        mongoose.connect(urlDb, (err) => {
            if (err) {
                reject(err);
            }else{
                console.log('BASE DE DATOS ONLINE');
                resolve(true);
            }
        })

    })
}


const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')

let idCaptura = null;

// capturaDBs.Crear_captura('prueba 1')
//     .then((id) => {
//         return id;
//     })
//     .catch((error)=>{
//         console.log('No se ha podido generar')
//     })


Conectar_y_crear_captura = async(urlDb, comentario) => {
    try {
        await Conectar_base_datos (urlDb);
        console.log('Añadimos:', comentario)
        idCaptura = await capturaDBs.Crear_captura (comentario);
        return true;
    }catch(error){
        throw new Error(error);
    }
}

Conectar_y_crear_captura (process.env.URLDB, process.argv[2])
    .then(()=>{
        console.log('Base de datos iniciada y captura creada')
    })
    .catch((error)=>{
        console.log('Error:', error)
    })

const com = new serialport("COM5", {
    baudRate: 9600
})
const parser = com.pipe(new InterByteTimeout({interval: 30}))
parser.on('data', (datos)=>{
    array = [...datos];
    if (array.length == 32) {
        valorPM25 = array[6] * 256;
        valorPM25 += array[7];
        valorPM10 = array[8] * 256;
        valorPM10 += array[9];
        const fecha = new Date();
        
        console.log(`${fecha.toISOString()} Valor partículas PM2.5:${valorPM25} - PM10.:${valorPM25}`)

        if (idCaptura) {
            datosDBs.Crear_muestra({
                capturaID: idCaptura,
                fecha,
                pm25: valorPM10,
                pm10: valorPM10
            })
            .then(()=>{
                console.log('Guardado')
            })
            .catch((error)=>{
                console.log('Error:', error)
            })
        }else{
            console.log('Muestra perdida porque no estaba lista la base de datos')
        }

    }
})



