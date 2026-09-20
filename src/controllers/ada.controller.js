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

// Llama a la API gratuita de Google Gemini (Google AI Studio)
async function llamarIA(pregunta) {
  const modelo = process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${process.env.AI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: PROMPT_SISTEMA }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: pregunta }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const detalle = await response.text();
    throw new Error(`Error de la API de Gemini (${response.status}): ${detalle}`);
  }

  const data = await response.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return texto || "No obtuve una respuesta clara, intenta de nuevo.";
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