var io = require('socket.io').listen(7590);

io.sockets.on('connection', function (socket) {
  console.log("open new");
  socket.send("approve");
  socket.on('message', function (msg) {
  	console.log("incoming message");
  	socket.send(msg);
  });
  socket.on('disconnect', function () { });
});

console.log("EOS tcp started");