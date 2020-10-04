const config = require('./config/config')
const mongoose = require('mongoose');
const capturaDBs = require ('./dbs/captura')
const fs = require('fs')
const rimraf = require('rimraf');

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

Crear_csv = async(captura) => {
    console.log(captura)
    try{
        fichero = ['Fecha;Tiempo(HH:MM:SS);Tiempo(ms);PM2.5;PM10'];
        datos = await Obtener_captura(captura._id);
        let tiempoInicial = 0;
        if (datos.length > 0) {
            tiempoInicial = datos[0].fecha.getTime();
        }
        for(j = 0;j < datos.length; j++){
            // fechaMuestra = Date.parse(datos[i].fecha)
            // linea = `${datos[j].fecha.toLocaleString()};${datos[j].pm25};${datos[j].pm10}`;
            let tiempo = new Date();
            tiempo.setTime(datos[j].fecha.getTime() - tiempoInicial);
            linea = `${datos[j].fecha.toLocaleString()};${datos[j].fecha.getHours() - 1};${datos[j].fecha.getMinutes()};${tiempo.getHours() - 1}:${tiempo.getMinutes()};${(datos[j].fecha.getTime() - tiempoInicial)/1000};${datos[j].pm25};${datos[j].pm10}`;

            fichero.push(linea);
        }
        total = fichero.join('\n');
        fs.writeFileSync(`./output/${captura.comentario}.csv`, total);
        console.log(`./output/${captura.comentario}.csv`)
        return true;
    }catch(error){
        console.log(error)
        throw new Error(error)

    }
}

Proceso_completo = async() => {
    try{
        if (fs.existsSync('./output')){
            rimraf.sync('./output')
        }
        if (fs.existsSync('./output')){
            console.log('Sigue existiendo')
        }
        fs.mkdirSync('./output');
        await Conectar_base_datos(process.env.URLDB);
        capturas = await capturaDBs.Obtener_capturas();
        console.log(capturas)
        for (i = 0; i < capturas.length; i++) {
            await Crear_csv(capturas[i]);
        }
        return capturas;
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

Proceso_completo()
    .then((resultado)=>{
        console.log('OK')
        process.exit(0);
    })
    .catch((error)=>{
        console.log(error)
    })