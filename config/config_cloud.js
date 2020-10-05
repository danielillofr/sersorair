process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    //urlDB = 'mongodb://192.168.1.14:27017/ioniza';
    urlDB='mongodb://usuario:password123@ds059957.mlab.com:59957/ioniza';
} else {
    urlDB = process.env.MONGO_URI;
}

panasonic = {
    paridad: 'even',
    tipo: 'panasonic'
}

honeywell = {
    paridad: 'none',
    tipo: 'honeywell'
}

process.env.URLDB = urlDB;

module.exports = { panasonic, honeywell}
