const config = require('./config/config')
datosDBs = require('./dbs/datos')
const mongoose = require('mongoose');
const capturaDBs = require ('./dbs/captura')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/capturasweb', (req,res)=>{
    capturaDBs.Obtener_capturas_con_ultimo()
        .then(capturas=>{
            res.json({
                ok: true,
                capturas
            })
        })
        .catch(error=>{
            res.json({
                ok: false,
                error
            })
        })
})

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


// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static( './public2'));

app.use(require('./routes/captura'));

Conectar_base_datos(process.env.URLDB)
    .then(()=>{
        console.log('Conectado a la base de datos')
    })
    .catch((error)=>{
        console.log('error conectando a base de datos:', error)
    })

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});