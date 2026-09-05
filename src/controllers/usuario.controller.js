const Usuario = require("../models/Usuario");

async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password_hash");
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil", detalle: error.message });
  }
}

async function actualizarAreasInteres(req, res) {
  try {
    const { areas_interes, patologias } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      {
        ...(areas_interes && { areas_interes }),
        ...(patologias && { patologias }),
      },
      { new: true }
    ).select("-password_hash");

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil", detalle: error.message });
  }
}

module.exports = { obtenerPerfil, actualizarAreasInteres };
