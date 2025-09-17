// pages/api/agent.js
import { runAgent } from '../../lib/agent.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const streamResponse = await runAgent(query).then(stream => stream.toTextStreamResponse());

    // Convertimos el Web ReadableStream a Async Iterator
    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
