const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const { verificaToken, verificaRol } = require('../middleweres/autenticacion')




app.get('/usuarios', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, message: err })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({ ok: true, usuarios, cuantos: conteo })
            })
        })



})

app.put('/usuario/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'estado', 'role', 'img'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }
        res.json(usuarioDB)
    })

})
app.post('/usuario', [verificaToken, verificaRol], (req, res) => {

    const body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,

    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }
        res.json({ OK: true, usuarioDB })
    })



})

app.delete('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id



    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, cambioEstado) => {

        console.log(cambioEstado);
        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }

        if (!cambioEstado) {
            return res.status(400).json({
                OK: false,
                err
            })
        }

        res.json({
            ok: true,

            cambioEstado
        })
    })


})


module.exports = app