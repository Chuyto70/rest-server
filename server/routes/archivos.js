const express = require('express')
const app = express()

const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario')
const Producto = require('../models/productos')

const fs = require('fs')
const path = require('path')
app.use(fileUpload())


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({ mensaje: 'No se subio ninguna imagen' });
    }
    let archivos = req.files.archivos

    let nombreArchivo = archivos.name.split('.')

    let extension = archivos.mimetype
    let extensionesValidas = ['image/png', 'image/jpg', 'image/jpeg']
    let tiposValidos = ['productos', 'usuarios']
    let nombreNuevo = `${id}-${new Date().getMilliseconds()}.jpg`

    if (!tiposValidos.includes(tipo)) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Tipo no valido, debe ser: ' + tiposValidos
        });
    }
    if (extensionesValidas.includes(archivos.mimetype)) {
        archivos.mv(`./uploads/${tipo}/${nombreNuevo}`, (err) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    mensaje: err
                });

            if (tipo === 'productos') {
                imagenProducto(id, res, nombreNuevo)
            }
            if (tipo === 'usuarios') {
                imagenUsuario(id, res, nombreNuevo)
            }

        })
    } else {
        res.json({
            ok: false,
            mensaje: `Extension ${archivos.mimetype} no es valida`
        })
    }
})

function imagenUsuario(id, res, nombreNuevo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreNuevo, 'usuario')
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }

        if (!usuarioDB) {
            borrarImagen(nombreNuevo, 'usuario')
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe'
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreNuevo

        usuarioDB.save((err, usuarioGuardado) => {
            return res.json({
                ok: true,
                usuarioGuardado,
                img: nombreNuevo
            })
        })
    })
}

function imagenProducto(id, res, nombreNuevo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreNuevo, 'productos')
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }
        if (!productoDB) {
            borrarImagen(nombreNuevo, 'productos')
            return res.status(500).json({
                ok: false,
                mensaje: 'Usuario no existe'
            });
        }

        borrarImagen(productoDB.img, 'productos')
        productoDB.img = nombreNuevo

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombreNuevo
            })
        })
    })

}

function borrarImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app