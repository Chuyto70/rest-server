const bodyParser = require('body-parser')
const express = require('express')
const app = express()
require('../global/config')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {

    res.json('get Metodo')
})

app.post('/usuario/:id', (req, res) => {

    let id = req.params.id
    res.json({
        id
    })
})
app.post('/usuario', (req, res) => {

    const body = req.body

    res.json(body)
})

app.delete('/', (req, res) => {
    res.send('Metodo delete')
})
app.put('/', (req, res) => {
    res.send('Metodo put')
})

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto 3000');
})