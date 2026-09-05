const mongoose = require("mongoose");

const consultaAdaSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  pregunta: { type: String, required: true },
  respuesta: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ConsultaAda", consultaAdaSchema);
