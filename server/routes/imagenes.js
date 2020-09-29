const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificaToken, verificaTokenImagen } = require('../middleweres/autenticacion')
const app = express()

app.get('/imagenes/:tipo/:img', verificaTokenImagen, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    let noImagen = path.resolve(__dirname, `../assets/no-image.jpg`)

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        res.sendFile(noImagen)
    }



})

module.exports = app