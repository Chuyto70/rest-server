const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
        let token = jwt.sign({ usuarioDB }, process.env.SEED, { expiresIn: 60 * 60 * 60 })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })



})


//configuracion de google 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.img,
        google: true

    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            message: e

        })
    })


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err
            })
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(403).json({
                    OK: false,
                    message: 'Debes identificarte con google'
                })

            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 60 })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            let usuario = new Usuario()
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        err
                    })
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: 60 * 60 * 60 })

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                }

            })
        }

    })




})






module.exports = app