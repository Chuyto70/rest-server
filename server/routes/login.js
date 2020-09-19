const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                OK: false,
                err: {
                    mensaje: '(Usuario) o contraseña incorrecto'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                OK: false,
                err: {
                    mensaje: 'Usuario o (contraseña) incorrecto'
                }
            })

        }
        let token = jwt.sign({ usuarioDB }, process.env.SEED, { expiresIn: 60 * 60 })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })



})






module.exports = app