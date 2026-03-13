import { GoogleGenAI } from "@google/genai";
import { PlanningData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePlanning(data: PlanningData): Promise<string> {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `Eres un experto pedagogo mexicano especializado en la Nueva Escuela Mexicana (NEM). 
      Tu tarea es generar una planeación didáctica detallada, profesional y creativa basada en los parámetros proporcionados.
      
      La planeación debe incluir:
      1. Nombre del Proyecto.
      2. Justificación.
      3. Propósito.
      4. Campo Formativo y Ejes Articuladores.
      5. Metodología (desarrollada por momentos según la metodología elegida).
      6. Actividades detalladas por sesión.
      7. Evaluación formativa (instrumentos y criterios).
      8. Recursos necesarios.
      
      Usa un tono profesional, empático y alineado a los valores de la NEM (comunidad, inclusión, pensamiento crítico).
      Formatea la respuesta en Markdown elegante.`,
    },
    contents: `Genera una planeación para:
    Grado: ${data.grade}
    Campo Formativo: ${data.campoFormativo}
    Metodología: ${data.metodologia}
    Contenido: ${data.contenido}
    PDA (Proceso de Desarrollo de Aprendizaje): ${data.pda}
    Ejes Articuladores: ${data.ejesArticuladores.join(", ")}`,
  });

  const response = await model;
  return response.text || "No se pudo generar la planeación.";
}
