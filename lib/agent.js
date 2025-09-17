// lib/agent.js
import { streamText } from "ai";
import { cerebras } from "./cerebras.js";
import { searchTool } from "./searchTool.js";
import 'dotenv/config';

export async function runAgent(userQuery) { // <--- quitamos : string
  const systemPrompt = `
Eres un agente de búsqueda web.
1. Haz entre 1 y 3 búsquedas con "searchTool".
2. Resume y razona con los resultados.
3. Da una respuesta final clara y concisa al usuario.
`;

  return streamText({
    model: cerebras("gpt-oss-120b"),
    system: systemPrompt,
    tools: { searchTool },
    prompt: userQuery,
  });
}

