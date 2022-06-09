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

  socket.on("send-message", (data) => {
    onMessage(socket, data);
  });

  socket.on("createRoom", (data) => {
    onCreateRoom(socket, data);
  });
});

function initialConnection(socket) {
  // each user have will have some default information
  USERS_INFO[socket.id] = { nickname: "guess_" + guessNumber };
  USERS_INFO[socket.id].currentRoom = "lobby";
  USERS_INFO[socket.id].numberOfRoomsCreated = 0;
  guessNumber++;
  // and by default all users join to the lobby
  socket.join("lobby");
  ROOMS_INFO["lobby"]++;
  // emit event to update the home page with the new information
  socket.emit(
    "joinedGroup",
    JSON.stringify({
      nickname: USERS_INFO[socket.id].nickname,
      room: "lobby",
      users: ROOMS_INFO["lobby"],
    })
  );
}

function onMessage(socket, data) {
  let { message } = JSON.parse(data);
  let { currentRoom, nickname } = USERS_INFO[socket.id];
  socket
    .to(currentRoom)
    .emit("send-message", JSON.stringify({ author: nickname, message }));
}

function onCreateRoom(socket, data) {
  let { room } = JSON.parse(data);
  room = room.toLowerCase();
  if (ROOMS_INFO[room] === undefined) {
    ROOMS_INFO[room] = 0;
    socket.emit("roomCreated", JSON.stringify({ room }));
  } else {
    socket.emit(
      "errorCreatingRoom",
      JSON.stringify({ msg: "This room is already taken" })
    );
  }
}

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
