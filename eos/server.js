// Node js Essence of shadows websocket server


var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 7590 });

wss.on("connection", function connection(ws) {
	ws.send("opened");
	console.log("new connection");
	ws.on('message', function hangle(msg) {
		console.log("Got: %s", msg);
		ws.send(msg);
	})

	
});

console.log("Started?");