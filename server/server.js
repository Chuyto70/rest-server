const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('../global/config')

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json

app.use(bodyParser.json())

//Rutas configuradas 

app.use(require('./routes/index'))

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto 3000');
})

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Conectado a la base de datos')
})