require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const adaRoutes = require("./routes/ada.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/ada", adaRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API Proyecto ADA funcionando 🚀" });
});

const PORT = process.env.PORT || 4000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
});
