const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth");
const { obtenerPerfil, actualizarAreasInteres } = require("../controllers/usuario.controller");

router.get("/perfil", verificarToken, obtenerPerfil);
router.put("/areas-interes", verificarToken, actualizarAreasInteres);

module.exports = router;
