socket.on("joinedRoom", function (data) {
  data = JSON.parse(data);
  document.getElementsByClassName("group-name")[0].innerHTML = data.room;
  document.getElementById("usersIn").innerText = data.users;
  nickname = nickname ? data.nickname : nickname;
  console.log("Joined room", data.room);
});

socket.on("leavedRoom", function (data) {
  let { users } = JSON.parse(data);
  document.getElementById("usersIn").innerText = users;
});

socket.on("send-message", function (data) {
  data = JSON.parse(data);
  let li = document.createElement("li");
  li.classList.add("msg");
  li.innerHTML = `<span class="author">${data.author}</span> ${data.message}`;
  document.getElementsByClassName("chat")[0].appendChild(li);
});

socket.on("roomCreated", function (data) {
  let { room } = JSON.parse(data);
  console.log(room);
});

// TODO: implement logic to handle error when trying to create a new room
// TODO: implement logic to handle error when trying to join a new room
