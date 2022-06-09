function sendMessage() {
  let message = document.getElementById("input-msg").value;
  document.getElementById("input-msg").value = "";
  message = cleanSpaces(message);
  if (message.length === 0) return;

  let initial_piece = message.split(" ")[0];
  switch (initial_piece) {
    case "/nickname":
      nickname = cleanSpaces(message.split(" ")[1]);
      if (nickname.length == 0) {
        alert("Provide a nickname");
        return;
      }
      socket.emit("newNickname", JSON.stringify({ nickname }));
      break;
    case "/joinroom":
      let roomToJoin = message.split(" ")[1];
      roomToJoin = cleanSpaces(roomToJoin);
      if (roomToJoin.length === 0) {
        alert("Provide a room name");
        return;
      }
      socket.emit("joinRoom", JSON.stringify({ room: roomToJoin }));
      break;
    case "/createroom":
      let room = message.split(" ")[1];
      room = cleanSpaces(room);
      if (room.length === 0) {
        alert("Provide a room name");
        return;
      }
      socket.emit("createRoom", JSON.stringify({ room }));
      break;
    case "/leaveroom":
      let inRoom = document.getElementsByClassName("group-name")[0].innerHTML;
      socket.emit("leaveRoom", JSON.stringify({ room: inRoom }));
      break;
    default: // logic to send messages to users in the same room
      addMessage(message);
      socket.emit("send-message", JSON.stringify({ message }));
      break;
  }
}

function addMessage(message) {
  let li = document.createElement("li");
  li.classList.add("msg");
  li.style.marginLeft = "auto";
  li.innerHTML = message;
  document.getElementsByClassName("chat")[0].appendChild(li);
}

function cleanSpaces(str) {
  if (str === undefined) return "";
  str = str.trim();
  str = str.replace("  ", " ");
  return str;
}
