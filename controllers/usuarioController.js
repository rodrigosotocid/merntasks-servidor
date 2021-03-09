const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }

    // Extraer emaul y password
    const { email, password } = req.body;

    try {
        // Revisar que el usuario registrado sea único
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El Usuario ya existe!' })
        }

        // crea el nuevo usuario
        usuario = new Usuario(req.body)

        // Hashear el Password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar usuario
        await usuario.save();

        // Crear y firmarl el JWT
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
        res.status(400).send('Hubo un error al crear un Usuario');
    }
}