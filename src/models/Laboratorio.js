const mongoose = require("mongoose");

const laboratorioSchema = new mongoose.Schema(
  {
    nombre_laboratorio: { type: String, required: true },
    nit_o_id_fiscal: { type: String, required: true, unique: true },
    email_contacto: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    areas_atendidas: [{ type: String }],
    verificado: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "creado_en", updatedAt: "actualizado_en" } }
);

module.exports = mongoose.model("Laboratorio", laboratorioSchema);
