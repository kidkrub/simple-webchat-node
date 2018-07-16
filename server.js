var express = require("express");
var http = require("http");

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);

var userslist = [];

server.listen(3333,'0.0.0.0', function(){
  console.log("Server is running on port 3333");
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/styles/styles.css", function(req, res){
  res.sendFile(__dirname + "/styles/styles.css");
});

io.on("connection", function(socket){
  var name = "";
  socket.on("has connected", function(username){
    name = username;
    userslist.push(username);
    io.emit("has connected", {username: username, usersList: userslist});
  });
  socket.on("disconnect", function(){
    userslist.splice(userslist.indexOf(name), 1);
    io.emit("has disconnected", {username: name, usersList: userslist});
  });
  
  socket.on("new message", function(data) {
    io.emit("new message", data);
  });
});