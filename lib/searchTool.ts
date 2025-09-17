import { tool } from "ai";
import { z } from "zod";
import { parallel } from "./parallel.js";

// Definimos inputSchema con Zod
export const searchTool = tool({
  name: "searchTool",
  description: "Busca información actualizada en la web",
  inputSchema: z.object({
    objective: z.string().min(1),
  }),
  execute: async (args) => {
    const { objective } = args; // args ya es tipado correctamente por Zod

    const result = await parallel.beta.search({
      objective,
      max_results: 5,
      max_chars_per_result: 500,
      processor: "base",
    });

    const texts = result.results.map((r: any) => r.text);

    return texts.join("\n\n");
  },
});




