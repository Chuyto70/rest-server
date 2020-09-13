process.env.PORT = process.env.PORT || 3000


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
    console.log('estas en dev')
} else {
    urlDB = 'mongodb+srv://Chuyto70:daqa1503@cluster0.cgvyq.mongodb.net/cafe'
    console.log('Estas en produccion');
}

process.env.URLDB = urlDB