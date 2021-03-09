const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log('DB Conectada!');
    } catch (error) {
        console.log(error);
        process.exit(1); // Si hay error en la conexion va a detener la app 
    }
}

module.exports = conectarDB;