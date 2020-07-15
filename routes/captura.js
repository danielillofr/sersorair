capturaDBs = require ('./../dbs/captura')
const express = require('express');
const app = express();

app.get('/capturas', (req,res) => {
    capturaDBs.Obtener_capturas()
        .then((capturas) => {
            res.json({
                ok: true,
                capturas
            })
        })
        .catch((error) => {
            res.json({
                ok: false
            })
        })

})

app.get('/captura', (req,res)=>{
    const body = req.body;
    if (!body.capturaID) {
        return res.json({
            ok:false,
            err: 'El id de la captura es necesario'
        })
    }
    capturaDBs.Obtener_captura(body.capturaID)
        .then((datos)=>{
            res.json({
                ok: true,
                datos
            })
        })
        .catch((error)=>{
            res.json({
                ok: false,
                error
            })
        })
})

app.get('/captura25', (req,res)=>{
    const body = req.body;
    if (!body.capturaID) {
        return res.json({
            ok:false,
            err: 'El id de la captura es necesario'
        })
    }
    capturaDBs.Crear_array_25(body.capturaID,'2020-07-14T13:06:37.962Z', '2020-07-14T13:08:37.962Z', 30)
        .then((datos)=>{
            res.json({
                ok: true,
                datos
            })
        })
        .catch((error)=>{
            console.log(error)
            res.json({
                ok: false,
                error
            })
        })
})


module.exports = app;