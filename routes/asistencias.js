const express = require("express");
const router = express.Router();
const controlador = require("../controllers/asistenciasControlador");

router.post("/", controlador.registrar);           // Registrar asistencia
router.get("/", controlador.listar);               // Listar todas las asistencias
router.get("/estadisticas", controlador.estadisticas); // Estadísticas por evento

module.exports = router;
