const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

const crearToken = (usuario, secreta, expiresIn) => {
    // console.log(usuario);
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign( {id, email, nombre, apellido}, secreta, {expiresIn})
    
}

// resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {token}) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA);
            return usuarioId;
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input}) => {

            const {email, password} = input;

            // revisar si el usuario esta registrado
            const existeUsuario = await Usuario.findOne({email});
            
            if(existeUsuario){
                throw new Error('El usuario ya está registrado');
            }

            // hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt)


            try {
                // Guardarlo en BD
                const usuario = new Usuario(input);
                usuario.save(); //guardarlo
                return usuario;
                
            } catch (error) {
                console.log(error);
            }

        },
        autenticarUsuario: async(_, {input}) => {

            const {email, password} = input

            // si el usuario existe
            const existeUsuario = await Usuario.findOne({email});

            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            // revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error('El password es incorrecto');
            }
            
            // crear el token
            return{
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        }
    }
}

module.exports = resolvers;