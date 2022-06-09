function sendMessage() {
  let message = document.getElementById("input-msg").value;
  message = message.trim();
  message = message.replace("  ", " ");

  if (message.length === 0) return;

  let initial_piece = message.split(" ")[0];
  switch (initial_piece) {
    case "/nickname":
      // TODO: implement the logic to change the nickname
      break;
    case "/joinroom":
      // TODO: implement the logic to join a new room
      break;
    case "/createroom":
      // TODO: implement the logic to create a new room
      break;
    case "/leaveroom":
      // TODO: implement the logic to create a new room
      break;
    default:
      addMessage(message);
      socket.emit("send-message", JSON.stringify({ message }));
      break;
  }
}

function addMessage(message) {
  let li = document.createElement("li");
  li.classList.add("msg");
  li.style.marginLeft = "auto";
  li.innerHTML = `<span class="author">${nickname}</span> ${message}`;
  document.getElementsByClassName("chat")[0].appendChild(li);
}
