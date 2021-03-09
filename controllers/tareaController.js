const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva Tarea
exports.crearTarea = async (req, res) => {

  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
  }

  try {
    // Extraer Proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' })
    }

    // Creamos la Tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });

  } catch (error) {
    console.log(error);
    res.statys(500).send('Hubo un error')
  }

}

// Obtener tareas
exports.obtenerTareas = async (req, res) => {

  try {
    // Extraer Proyecto y comprobar si existe
    const { proyecto } = req.query;
    //console.log(req.query); // usamos query en vez de body para poder hacer la lectura del mismo

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' })
    }

    // Obtener las Tareas por Proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });

  } catch (error) {
    console.log(errror);
    res.status(500).send('Hubo un error');
  }
}

// Actualizar una Tarea
exports.actualizarTarea = async (req, res) => {
  try {

    // Extraer Proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    // Revisa si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: 'No Existe esa Tarea' })
    }

    // Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' })
    }

    // Crear un Objeto con la nueva información
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    // Guardar la Tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
    res.json({ tarea });

  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
}

// Elimina una Tarea
exports.eliminarTarea = async (req, res) => {
  try {
    // Extraer Proyecto y comprobar si existe
    const { proyecto } = req.query;

    // Revisa si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: 'No Existe esa Tarea' })
    }

    // Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' })
    }

    // Eliminar 
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea eliminada correctamente' });


  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el Servidor')
  }
}