const ConsultaAda = require("../models/ConsultaAda");

const PROMPT_SISTEMA = `Eres ADA, un asistente de orientación en salud.
Reglas:
- Das información general y educativa sobre síntomas y enfermedades.
- NUNCA das un diagnóstico definitivo.
- Siempre recomiendas consultar a un profesional de la salud para confirmar cualquier diagnóstico o tratamiento.
- Si detectas una posible urgencia (dolor en el pecho, dificultad para respirar, etc.), indicas buscar atención médica inmediata.
- Respondes en español, de forma clara y empática.`;

async function preguntarAda(req, res) {
  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: "La pregunta es obligatoria" });
    }

    const respuestaIA = await llamarIA(pregunta);

    const consulta = await ConsultaAda.create({
      usuario_id: req.usuario.id,
      pregunta,
      respuesta: respuestaIA,
    });

    res.json({ respuesta: respuestaIA, consulta_id: consulta._id });
  } catch (error) {
    res.status(500).json({ error: "Error al consultar a ADA", detalle: error.message });
  }
}

async function llamarIA(pregunta) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.AI_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "claude-sonnet-4-6",
      max_tokens: 500,
      system: PROMPT_SISTEMA,
      messages: [{ role: "user", content: pregunta }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error de la API de IA: ${response.status}`);
  }

  const data = await response.json();
  const bloqueTexto = data.content.find((bloque) => bloque.type === "text");
  return bloqueTexto ? bloqueTexto.text : "No obtuve una respuesta clara, intenta de nuevo.";
}

async function obtenerHistorial(req, res) {
  try {
    const historial = await ConsultaAda.find({ usuario_id: req.usuario.id }).sort({ fecha: -1 });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial", detalle: error.message });
  }
}

module.exports = { preguntarAda, obtenerHistorial };
