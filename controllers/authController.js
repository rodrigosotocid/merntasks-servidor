const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }

    // Extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un Usuario registrado
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // si el Usuario existe revisar su password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        // Si todo es correcto...Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            // Una hora en segundos
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            // mensaje de confirmación
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
    }
}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error' });
    }
}