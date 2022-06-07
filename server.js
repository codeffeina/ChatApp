const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const root = path.join(__dirname, "public");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const USERNAMES = new Map();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(root));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "login.html"));
});

app.post("/", (req, res) => {
  let { username, socketId } = req.body;
  if (!Array.from(USERNAMES.values()).includes(username)) {
    USERNAMES.set();
  }
  res.redirect("/");
});

io.on("connection", function (socket) {
  socket.on("login", function (data) {
    if (!Array.from(USERNAMES.values()).includes(data.username)) {
      USERNAMES.set(socket.id, data.username);
      socket.emit("login");
    }
    console.log(USERNAMES);
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
