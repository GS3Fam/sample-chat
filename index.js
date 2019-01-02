const
  express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  path = require('path');

let
  users = [],
  connections = [];

server.listen(3000)
console.log('Connected to Server')

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
  res.sendFile(`${__dirname}/view/index.html`)
})

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log(`!-- con: ${connections.length} sockets connected`);

  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
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
