const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let users = {};

function getDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// 🔥 random names
const names = ["Sawant", "Tutedude", "Neha", "Riya", "Arjun", "Kiran", "Vikram"];

function randomName() {
  return names[Math.floor(Math.random() * names.length)] + "_" + Math.floor(Math.random() * 100);
}

// 🔥 random color
function randomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

io.on("connection", (socket) => {
  users[socket.id] = {
    x: 100,
    y: 100,
    name: randomName(),
    color: randomColor(),
  };

  socket.on("move", (pos) => {
    users[socket.id].x = pos.x;
    users[socket.id].y = pos.y;

    io.emit("users", users);

    Object.keys(users).forEach((id) => {
      if (id !== socket.id) {
        const dist = getDistance(users[socket.id], users[id]);

        if (dist < 120) {
          socket.join(id);
          socket.emit("connected", id);
        } else {
          socket.leave(id);
          socket.emit("disconnected");
        }
      }
    });
  });

  socket.on("message", ({ to, msg }) => {
    io.to(to).emit("message", {
      from: users[socket.id].name, // 🔥 name instead of id
      msg,
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
  });
});

server.listen(5000, () => console.log("Server running on 5000"));