socket.on("joinedGroup", function (data) {
  data = JSON.parse(data);
  document.getElementsByClassName("group-name")[0].innerHTML = data.room;
  document.getElementById("usersIn").innerText = data.users;
  console.log(data);
});
