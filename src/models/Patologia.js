const mongoose = require("mongoose");

const patologiaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  area: { type: String, required: true },
  descripcion: { type: String },
});

module.exports = mongoose.model("Patologia", patologiaSchema);
