document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

socket.on("joinedRoom", function (data) {
  data = JSON.parse(data);
  document.getElementsByClassName("group-name")[0].innerHTML = data.room;
  document.getElementById("usersIn").innerText = data.users;
  document.getElementById("groupNames").innerHTML = "";
  for (let room of data.rooms) {
    let li = document.createElement("li");
    li.innerHTML = "> " + room;
    document.getElementById("groupNames").appendChild(li);
  }
  // nickname = nickname ? data.nickname : nickname; //TODO: remove this variable
  console.log("Joined room", data.room);
});

socket.on("leavedRoom", function (data) {
  let { users } = JSON.parse(data);
  document.getElementById("usersIn").innerText = users;
});

socket.on("send-message", function (data) {
  data = JSON.parse(data);
  let chatElement = document.getElementsByClassName("chat")[0];
  console.log(chatElement.scrollHeight);
  let li = document.createElement("li");
  li.classList.add("msg");
  li.innerHTML = `<span class="author">${data.author}</span> ${data.message}`;
  chatElement.appendChild(li);
  chatElement.scrollTo(0, chatElement.scrollHeight);
});

socket.on("roomCreated", function (data) {
  let { room } = JSON.parse(data);
  let li = document.createElement("li");
  li.innerHTML = "> " + room;
  document.getElementById("groupNames").appendChild(li);
});

socket.on("newNickname", function (data) {
  let { nickname, oldNickname } = JSON.parse(data);
  let li = document.createElement("li");
  li.classList.add("msg");
  li.classList.add("info");
  li.innerHTML = `<i>${oldNickname}</i> change its nickname to: <i>${nickname}</i>`;
  document.getElementsByClassName("chat")[0].appendChild(li);
});

socket.on("updateChatHeight", function () {
  let chatElement = document.getElementsByClassName("chat")[0];
  chatElement.scrollTo(0, chatElement.scrollHeight);
});

// TODO: implement logic to handle error when trying to create a new room
// TODO: implement logic to handle error when trying to join a new room
