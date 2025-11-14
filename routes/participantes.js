const express = require("express");
const router = express.Router();
const controlador = require("../controllers/participantesControlador");

router.post("/", controlador.crear);
router.get("/", controlador.listar);
router.get("/:id", controlador.obtener);
router.put("/:id", controlador.actualizar);
router.delete("/:id", controlador.eliminar);

module.exports = router;
