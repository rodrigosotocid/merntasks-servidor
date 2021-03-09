const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Craer una Tarea
// api/tareas
router.post('/',
  auth,
  [
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('proyecto', 'El Proyecto es obligatorio').not().isEmpty()
  ],
  tareaController.crearTarea
);

// Obtener las Tareas por Proyecto
router.get('/',
  auth,
  tareaController.obtenerTareas
);

// Actualizar Tarea
router.put('/:id',
  auth,
  tareaController.actualizarTarea
);

// Eliminar Tarea
router.delete('/:id',
  auth,
  tareaController.eliminarTarea
);

module.exports = router;