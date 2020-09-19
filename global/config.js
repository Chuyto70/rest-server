process.env.PORT = process.env.PORT || 3000


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


process.env.SEED = process.env.SEED || 'secreto-seed'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
    console.log('estas en dev')
} else {
    urlDB = process.env.MONGO_URI
    console.log('Estas en produccion');
}

process.env.URLDB = urlDB