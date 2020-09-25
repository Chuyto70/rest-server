const express = require('express')

const { verificaToken, verificaRol } = require('../middleweres/autenticacion')

const app = express()

const Categoria = require('../models/categorias')
const usuario = require('../models/usuario')


// Mostrar categorias

app.get('/categoria', verificaToken, (req, res) => {
    let datos = req.usuario


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: err
                })
            }
            res.json({
                ok: true,
                resultado: categorias
            })
        })



})

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            })
        }

        res.json({
            ok: true,
            categoria
        })
    })



})

app.post('/categoria', verificaToken, (req, res) => {
    let datos = req.usuario._id
    let body = req.body


    let nuevaCat = new Categoria({
        descripcion: body.descripcion,
        usuario: datos
    })

    nuevaCat.save((err, datoNuevo) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            })
        }
        res.json({
            ok: true,
            categoria: datoNuevo
        })
    })

})

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, actualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            })
        }

        res.json({
            ok: true,
            actualizado
        })
    })

})

app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id




    Categoria.findByIdAndRemove(id, (err, eliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            })
        }
        res.json({
            ok: true,
            eliminaste: eliminado
        })
    })
})


// Mostrar usuario por id









module.exports = app