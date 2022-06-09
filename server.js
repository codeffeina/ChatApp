const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const root = path.join(__dirname, "public");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// this variable holds information about each user (socket) connected
const USERS_INFO = {};
const ROOMS_INFO = {
  lobby: 0,
};
let guessNumber = 0;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(root));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "login.html"));
});

io.on("connection", function (socket) {
  initialConnection(socket);
});

function initialConnection(socket) {
  // each user have a default nickname
  USERS_INFO[socket.id] = "guess_" + guessNumber;
  guessNumber++;
  // and by default all users join to the lobby
  socket.join("lobby");
  ROOMS_INFO["lobby"]++;
  // emit event to update the home page
  socket.emit(
    "joinedGroup",
    JSON.stringify({ room: "lobby", users: ROOMS_INFO["lobby"] })
  );
}

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
