const config = require('./config/config')
serialport = require ('serialport')
datosDBs = require('./dbs/datos')
const mongoose = require('mongoose');
const capturaDBs = require ('./dbs/captura')

const express = require('express')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const app = express();

let server = http.createServer(app);
let io = socketIO(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());



// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static( './public'));
console.log('./public')

app.use(require('./routes/captura'));


if (process.argv.length < 5) {
    console.log('Indique un comentario (sin espacios), puerto com y puerto lan')
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

const com = new serialport(process.argv[3], {
    baudRate: 9600
})

com.on('error', function(err) {
    console.log('Error: ', err.message)
    process.exit(1);
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
            io.emit('Medida',{
                pm25: valorPM10,
                pm10: valorPM10
            } )
        }else{
            console.log('Muestra perdida porque no estaba lista la base de datos')
        }

    }
})

io.on('connection', (socket)=>{
    console.log('Cliente conectado');
    
    socket.on('disconnect', ()=>{
        console.log('Cliente desconectado')
    })
})

app.get('/captura25', (req,res)=>{
        capturaDBs.Crear_array_25(idCaptura,null,null,null)
            .then((valores)=>{
                res.json({
                    ok: true,
                    datos: valores
                })
            })
            .catch((err)=>{
                console.log(err);
                res.json({
                    ok: false,
                    err
                })
            })
})
app.get('/captura10', (req,res)=>{
        capturaDBs.Crear_array_10(idCaptura,null,null,null)
            .then((valores)=>{
                res.json({
                    ok: true,
                    datos: valores
                })
            })
            .catch((err)=>{
                console.log(err);
                res.json({
                    ok: false,
                    err
                })
            })
})

app.get('/comentario', (req,res)=>{
    res.json({
        comentario: process.argv[2]
    })
})

server.listen(process.argv[4], () => {
    console.log('Escuchando puerto: ', process.argv[4]);
});

