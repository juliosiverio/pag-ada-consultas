const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth");
const { preguntarAda, obtenerHistorial } = require("../controllers/ada.controller");

router.post("/preguntar", verificarToken, preguntarAda);
router.get("/historial", verificarToken, obtenerHistorial);

module.exports = router;
