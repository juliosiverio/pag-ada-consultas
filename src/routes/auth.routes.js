const express = require("express");
const router = express.Router();
const { registrarUsuario, registrarLaboratorio, login } = require("../controllers/auth.controller");

router.post("/register", registrarUsuario);
router.post("/register-laboratorio", registrarLaboratorio);
router.post("/login", login);

module.exports = router;
