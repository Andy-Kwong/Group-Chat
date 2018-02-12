var express = require("express");
var app = express();
var name = "none"; 
var messages = [];
var loggedIn = false;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function (req, res) {

    res.render("index");
})

var server = app.listen(8000, function() { 
    console.log("listening on port 8000")
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
    console.log("client/socket is connected!");

    socket.on("newUsername", function(newName) {
        name = newName
        messages.push({name : "Admin", message : "New user " + name + " joined the chat!"})
        socket.emit("userInput", messages)
    })

    socket.on("newUserInput", function(data) {
        if (data == "check") {
            socket.emit("userInput", name);
        }
        else {
            console.log("new message!")
            messages.push({name : name, message : data})
            io.emit("userInput", messages);
            console.log(messages);
        }
    })
    
})
