const express = require("express");
const app = express();
const puerto = 3000;

app.use(express.json());

// Rutas
app.use("/participantes", require("./routes/participantes"));
app.use("/eventos", require("./routes/eventos"));
app.use("/asistencias", require("./routes/asistencias"));

app.listen(puerto, () => {
  console.log("Servidor ejecutándose en el puerto " + puerto);
});
