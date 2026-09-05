const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    patologias: [{ type: String }],
    areas_interes: [{ type: String }],
    rol: {
      type: String,
      enum: ["usuario", "laboratorio", "admin"],
      default: "usuario",
    },
  },
  { timestamps: { createdAt: "creado_en", updatedAt: "actualizado_en" } }
);

module.exports = mongoose.model("Usuario", usuarioSchema);
