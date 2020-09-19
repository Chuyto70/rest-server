let jwt = require('jsonwebtoken')


let verificaToken = (req, res, next) => {

    let token = req.get('token')


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: err
            })
        }

        req.usuario = decoded.usuarioDB
            //console.log(req.usuario);
        next()

    })



}


let verificaRol = (req, res, next) => {
    let usuario = req.usuario
    console.log(usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'No eres administrador'
            }
        })
    } else {
        next()
    }


}


module.exports = {
    verificaToken,
    verificaRol
}