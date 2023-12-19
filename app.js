const express = require("express");
const app = express();
app.use(express.json());

// Importamos el router de libros
const librosRouter = require("./routes/libros");

// Importamos el middleware, Error Handler
const errorHandler = require("./middlewares/errorHandler");

app.use("/libros", librosRouter);

app.use(errorHandler);

const port = 3000;

// Iniciamos el servidor en el puerto '3000'
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
