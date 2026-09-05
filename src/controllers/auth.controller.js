const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Laboratorio = require("../models/Laboratorio");

function generarToken(id, rol) {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

// Registro de usuario normal
async function registrarUsuario(req, res) {
  try {
    const { nombre, apellido, email, password, patologias, areas_interes } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ error: "Ese email ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password_hash,
      patologias: patologias || [],
      areas_interes: areas_interes || [],
    });

    const token = generarToken(nuevoUsuario._id, nuevoUsuario.rol);

    res.status(201).json({
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
  }
}

// Registro de laboratorio
async function registrarLaboratorio(req, res) {
  try {
    const { nombre_laboratorio, nit_o_id_fiscal, email_contacto, password, areas_atendidas } = req.body;

    if (!nombre_laboratorio || !nit_o_id_fiscal || !email_contacto || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const existe = await Laboratorio.findOne({ email_contacto });
    if (existe) {
      return res.status(409).json({ error: "Ese email ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoLab = await Laboratorio.create({
      nombre_laboratorio,
      nit_o_id_fiscal,
      email_contacto,
      password_hash,
      areas_atendidas: areas_atendidas || [],
    });

    const token = generarToken(nuevoLab._id, "laboratorio");

    res.status(201).json({
      laboratorio: {
        id: nuevoLab._id,
        nombre_laboratorio: nuevoLab.nombre_laboratorio,
        email_contacto: nuevoLab.email_contacto,
        verificado: nuevoLab.verificado,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar laboratorio", detalle: error.message });
  }
}

// Login centralizado (usuario o laboratorio, según el campo "tipo")
async function login(req, res) {
  try {
    const { email, password, tipo } = req.body; // tipo: "usuario" | "laboratorio"

    if (!email || !password || !tipo) {
      return res.status(400).json({ error: "Email, password y tipo son obligatorios" });
    }

    const Modelo = tipo === "laboratorio" ? Laboratorio : Usuario;
    const campoEmail = tipo === "laboratorio" ? "email_contacto" : "email";

    const cuenta = await Modelo.findOne({ [campoEmail]: email });
    if (!cuenta) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, cuenta.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const rol = tipo === "laboratorio" ? "laboratorio" : cuenta.rol;
    const token = generarToken(cuenta._id, rol);

    res.json({ token, rol });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión", detalle: error.message });
  }
}

module.exports = { registrarUsuario, registrarLaboratorio, login };
