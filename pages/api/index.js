export default function Home() {
  return (
    <>
      <head>
        <title>Agente AI Web Search</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
          }
          h1 { margin-bottom: 20px; color: #333; }
          .chat-container {
            width: 100%;
            max-width: 600px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .messages {
            flex: 1;
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
          }
          .message {
            margin-bottom: 15px;
            padding: 10px 15px;
            border-radius: 15px;
            max-width: 80%;
            word-wrap: break-word;
          }
          .user { background: #007bff; color: #fff; align-self: flex-end; }
          .agent { background: #e5e5ea; color: #000; align-self: flex-start; }
          .input-area {
            display: flex;
            border-top: 1px solid #ddd;
          }
          .input-area input {
            flex: 1;
            padding: 12px;
            font-size: 16px;
            border: none;
            outline: none;
          }
          .input-area button {
            padding: 12px 20px;
            border: none;
            background: #007bff;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.2s;
          }
          .input-area button:hover { background: #0056b3; }
        `}</style>
      </head>
      <body>
        <h1>Agente AI Web Search</h1>
        <div className="chat-container">
          <div className="messages" id="messages"></div>
          <div className="input-area">
            <input type="text" id="query" placeholder="Escribe tu pregunta..." />
            <button id="sendBtn">Enviar</button>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            const sendBtn = document.getElementById('sendBtn');
            const queryInput = document.getElementById('query');
            const messagesEl = document.getElementById('messages');

            function appendMessage(text, sender) {
              const div = document.createElement('div');
              div.className = \`message \${sender}\`;
              div.textContent = text;
              messagesEl.appendChild(div);
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            sendBtn.addEventListener('click', async () => {
              const query = queryInput.value.trim();
              if (!query) return;

              appendMessage(query, "user");
              queryInput.value = "";
              appendMessage("Cargando...", "agent");

              const res = await fetch("/api/agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
              });

              if (!res.body) return;

              const reader = res.body.getReader();
              const decoder = new TextDecoder();
              let text = "";
              const lastMessage = messagesEl.querySelector('.agent:last-child');

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                text += decoder.decode(value, { stream: true });
                lastMessage.textContent = text;
              }
            });

            queryInput.addEventListener("keypress", (e) => {
              if (e.key === "Enter") sendBtn.click();
            });
          `
        }} />
      </body>
    </>
  );
}
