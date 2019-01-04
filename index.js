const
  express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  path = require('path');
  // siofu = require("socketio-file-upload");

let
  users = [],
  connections = [];

server.listen(process.env.PORT || 3000)
console.log('Connected to Server')

app.use(express.static(__dirname + '/public'));
// app.use(siofu.router)

app.get('/', (req, res)=>{
  res.sendFile(`${__dirname}/view/index.html`)
})

io.sockets.on('connection', function(socket){
  // var uploader = new siofu();
  //   uploader.dir = "./public/images";
  //   uploader.listen(socket);

  connections.push(socket);
  console.log(`!-- con: ${connections.length} sockets connected`);

  // Disconnect
  socket.on('disconnect', function(data){
    socket.username ? users.splice(users.indexOf(socket.username), 1) : 0
    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);
    console.log(`!-- dc: ${connections.length} sockets connected`)
  })

  // Send Message
  socket.on('mess:send', (data)=>{
    io.sockets.emit('mess:new', { msg: data , user: socket.username })
  })

  // new user
  socket.on('user:new', (data)=>{
    socket.username = data
    users.push(socket.username)
    updateUsernames();
  })

  function updateUsernames(){
    io.sockets.emit('user:get', users)
  }


})
