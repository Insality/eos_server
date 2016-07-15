// Node js Essence of shadows websocket server


var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 7590 });

var clients = [];

wss.on("connection", function connection(ws) {
	ws.send("Server accept you connection");

	clients.push(ws);
	console.log("opened new connection");
	console.log(clients.length);

	ws.on('close', function() {
		clients.splice(clients.indexOf(ws), 1);
		console.log("close connection");
		console.log(clients.length);
	})

	ws.on('message', function hangle(msg) {
		console.log("Got: %s", msg);
		ws.send(msg);
	})

	
});

console.log("Started EOS Server WebSocket");

setInterval(function(){
	console.log('Second Server Tick');
	clients.forEach(function(ws) { 
		ws.send("from interval message");
	});
}, 1000);