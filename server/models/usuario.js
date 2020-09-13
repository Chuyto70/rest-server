const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']

    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject()
    delete userObj.password;
    return userObj
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} No es valido' })

module.exports = mongoose.model('Usuario', usuarioSchema)