import { useEffect, useRef, useState } from "react";
import socket from "./socket";
import * as PIXI from "pixi.js";

function App() {
  const pixiRef = useRef(null);
  const [chatUser, setChatUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const position = useRef({ x: 100, y: 100 });

  useEffect(() => {
    let app;

    const init = async () => {
      app = new PIXI.Application();
      await app.init({
        width: 900,
        height: 500,
        backgroundColor: 0x1e1e1e,
      });

      pixiRef.current.appendChild(app.canvas);

      const players = {};

      socket.emit("move", position.current);

      socket.on("users", (data) => {
        Object.keys(data).forEach((id) => {
          if (!players[id]) {
            const container = new PIXI.Container();

            const circle = new PIXI.Graphics();
            circle.beginFill(data[id].color);
            circle.drawCircle(0, 0, 15);
            circle.endFill();

            const text = new PIXI.Text(data[id].name, {
              fontSize: 12,
              fill: "white",
            });

            text.anchor.set(0.5);
            text.y = -25;

            container.addChild(circle);
            container.addChild(text);

            app.stage.addChild(container);
            players[id] = container;
          }

          players[id].x = data[id].x;
          players[id].y = data[id].y;
        });
      });

      socket.on("connected", (id) => {
        setChatUser(id);
      });

      socket.on("disconnected", () => {
        setChatUser(null);
      });

      socket.on("message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      const handleKey = (e) => {
        const speed = 5;

        if (e.key === "w") position.current.y -= speed;
        if (e.key === "s") position.current.y += speed;
        if (e.key === "a") position.current.x -= speed;
        if (e.key === "d") position.current.x += speed;

        socket.emit("move", position.current);
      };

      window.addEventListener("keydown", handleKey);

      return () => {
        window.removeEventListener("keydown", handleKey);
        socket.off("users");
        socket.off("connected");
        socket.off("disconnected");
        socket.off("message");
        app.destroy(true);
      };
    };

    init();
  }, []);

  const sendMessage = () => {
    if (!msg || !chatUser) return;

    socket.emit("message", {
      to: chatUser,
      msg,
    });

    setMessages((prev) => [...prev, { from: "me", msg }]);
    setMsg("");
  };

  return (
    <div style={{ display: "flex", color: "white" }}>
      <div ref={pixiRef}></div>

      {chatUser && (
        <div style={{ marginLeft: "20px", width: "250px" }}>
          <h3>💬 Chat</h3>

          <div
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid gray",
              padding: "10px",
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.from}:</b> {m.msg}
              </div>
            ))}
          </div>

          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ width: "70%" }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;