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
const NICKNAMES = [];
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

  socket.on("joinRoom", (data) => {
    onJoinRoom(socket, data);
  });

  socket.on("newNickname", (data) => {
    onNewNickname(socket, data);
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
    "joinedRoom",
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
  if (
    ROOMS_INFO[room] !== undefined ||
    USERS_INFO[socket.id].numberOfRoomsCreated == 3
  ) {
    socket.emit(
      "errorCreatingRoom",
      JSON.stringify({
        msg: "This room is taken or you create too much rooms (max 3)",
      })
    );
  } else {
    ROOMS_INFO[room] = 0;
    USERS_INFO[socket.id].numberOfRoomsCreated++;
    socket.emit("roomCreated", JSON.stringify({ room }));
  }
}

function onJoinRoom(socket, data) {
  let { room } = JSON.parse(data);
  if (ROOMS_INFO[room] == undefined) {
    socket.emit(
      "errorJoiningRoom",
      JSON.stringify({ msg: "This room that's not exits!" })
    );
    return;
  }

  // first let's update the number of user in the current room
  let usersConnected = --ROOMS_INFO[USERS_INFO[socket.id].currentRoom];
  socket // emit event to inform the update
    .to(USERS_INFO[socket.id].currentRoom)
    .emit("leavedRoom", JSON.stringify({ users: usersConnected }));

  // join the new room
  socket.join(room);
  // update the number of users in this room
  let users = ++ROOMS_INFO[room];
  // let { nickname } = USERS_INFO[socket.id];
  // update the new room for this users
  USERS_INFO[socket.id].currentRoom = room;
  io.to(room).emit("joinedRoom", JSON.stringify({ room, users }));
}

function onNewNickname(socket, data) {
  let { nickname } = JSON.parse(data);
  if (NICKNAMES[nickname] === undefined) {
    socket.emit(
      "errorChangingNickname",
      JSON.stringify({ msg: "This nickname is already taken" })
    );
    return;
  }
  let oldNickname = USERS_INFO[socket.id].nickname;
  USERS_INFO[socket.id].nickname = nickname;
  socket
    .to(USERS_INFO[socket.id].currentRoom)
    .emit("newNickname", JSON.stringify({ nickname, oldNickname }));
}

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
