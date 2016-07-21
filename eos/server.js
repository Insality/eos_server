// Node js Essence of shadows websocket server
global._ = require('underscore');

var Server = function() {
	var Game = require("./game/game");
	var WebSocketServer = require("ws").Server;

	this.wss = new WebSocketServer({ port: 7590 });
	this.clients = [];

	this.id = 1000;
	

	this.getUniqueId = function() {
		return this.id++;
	};

	this.onNewConnection = function(ws) {
		ws.id = this.getUniqueId();
		this.game.onConnect(ws);
		this.clients.push(ws);
		console.log("New connection. Online: " + this.clients.length);
	};

	this.onMessage = function(ws, msg) {
		msg = JSON.parse(msg);
		this.game.onMessage(ws, msg);
	};

	this.onClose = function(ws) {
		this.game.onDisconnect(ws);
		this.clients.splice(this.clients.indexOf(ws), 1);
		console.log("Player disconnected. Online: " + this.clients.length);
	};

	this.getMs = function() {
		return new Date().getTime();
	}

	this.wss.on("connection", _.bind(function connection(ws) {
		this.onNewConnection(ws);
		ws.on('message', _.bind(function(msg) { this.onMessage(ws, msg); }, this));
		ws.on('close', _.bind(function() { this.onClose(ws); }, this));
	}, this));

	this.now = this.getMs();
	setInterval(_.bind(function() {
		var dt = this.getMs() - this.now;
		this.now = this.getMs();

		this.game.update(dt/1000);
	}, this), 1000/60);

	setInterval(_.bind(function() { 
		this.game.sendSnapshot(); 
	}, this), 1000/20 );

	this.game = new Game(this);
	console.log("Started EOS WebSocket Server");
}

new Server();