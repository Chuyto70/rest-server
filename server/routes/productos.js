var express = require('express')
const mongoose = require('mongoose')
const { verificaToken } = require('../middleweres/autenticacion')

const app = express()


let Producto = require('../models/productos')

app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: err
                })
            }
            res.json({
                productos: productos
            })
        })
})


app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'descripcion').exec((err, data) => {
        if (err) {
            res.status(400).json({ ok: false, mensaje: err })
        }
        res.json({ ok: true, data })
    })

})

app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .exec((err, result) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: err
                })

            }
            res.json({
                ok: true,
                result
            })
        })
})

app.post('/productos', verificaToken, (req, res) => {
    let datos = req.usuario._id

    let body = req.body



    let nuevoProducto = new Producto({
        usuario: datos,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria



    })

    nuevoProducto.save((err, nuevoProducto) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        }
        res.json({
            ok: true,
            nuevoProducto
        })
    })
})


app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body


    Producto.findByIdAndUpdate(id, body, { new: true }, (err, nuevoDat) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        }
        res.json({
            ok: true,
            nuevoDat
        })
    })
})

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, itemBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        }

        res.json({
            ok: true,
            itemBorrado
        })
    })
})










module.exports = app