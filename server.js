const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const root = path.join(__dirname, "public");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(root));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "login.html"));
});

io.on("connection", function (socket) {});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
