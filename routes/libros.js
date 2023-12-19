const express = require("express");
const router = express.Router();
const libros = require("../data");
const joi = require("joi"); // camelCase en vez de PascalCase para mejor consistencia ;)

const libroSchema = joi.object({
  titulo: joi.string().required().label("Título"),
  autor: joi.string().required().label("Autor"),
});

// Obtenemos todos los libros disponibles.
router.get("/", (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});

// Obtenemos un libro por su ID.
router.get("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("El libro no fue encontrado.");
      error.status = 404;
      throw error;
    }

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

// Creamos un nuevo libro.
router.post("/", (req, res, next) => {
  try {
    const { error, value } = libroSchema.validate(req.body);

    if (error) {
      const validationError = new Error("Error de validación.");
      validationError.status = 400;
      validationError.details = error.details.map((detail) => detail.message);
      throw validationError;
    }

    const { titulo, autor } = value;

    const nuevoLibro = {
      id: `${libros.length + 1}`, // Obtenemos la longitud del array tipo Int, le sumamos el siguiente y lo pasamos como un tipo String.
      titulo,
      autor,
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});

// Modificamos un libro.
router.put("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const { error, value } = libroSchema.validate(req.body);

    if (error) {
      const validationError = new Error("Error de validación.");
      validationError.status = 400;
      validationError.details = error.details.map((detail) => detail.message);
      throw validationError;
    }

    const { titulo, autor } = value;

    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("El libro no existe.");
      error.status = 404;
      throw error;
    }

    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

// Borramos un libro.
router.delete("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const index = libros.findIndex((l) => l.id === id);

    if (index === -1) {
      const error = new Error("El libro no existe o ya ha sido eliminado.");
      error.status = 404;
      throw error;
    }

    const libroEliminado = libros.splice(index, 1);
    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
