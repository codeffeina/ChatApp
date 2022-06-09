socket.on("joinedGroup", function (data) {
  data = JSON.parse(data);
  document.getElementsByClassName("group-name")[0].innerHTML = data.room;
  document.getElementById("usersIn").innerText = data.users;
  nickname = data.nickname;
  // console.log(data);
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
