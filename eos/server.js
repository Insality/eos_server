// Node js Essence of shadows websocket server
var Game = require("./game/game");
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 7590 });

var clients = [];
var game = new Game();
var id = 1000;

function onNewConnection(ws) {
	ws.id = id;
	id++;
	game.onConnect(ws);
	clients.push(ws);
	console.log("New connection. Online: " + clients.length);
}

function onMessage(ws, msg) {
	msg = JSON.parse(msg);
	game.onMessage(ws, msg);
}

function onClose(ws) {
	game.onDisconnect(ws);
	clients.splice(clients.indexOf(ws), 1);
	console.log("Player disconnected. Online: " + clients.length);
}

wss.on("connection", function connection(ws) {
	onNewConnection(ws);
	ws.on('message', function(msg) { onMessage(ws, msg); });
	ws.on('close', function() { onClose(ws); });
});

function getMs() {
	return new Date().getTime();
}

var now = getMs();

setInterval(function() {
	var dt = getMs() - now;
	now = getMs();

	game.update(dt/1000);
}, 1000/60);

setInterval(function() { game.sendSnapshot(); }, 1000/20 );

console.log("Started EOS WebSocket Server");