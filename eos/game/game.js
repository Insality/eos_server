var Player = require('./player');

module.exports = function() {
	this.players = [];
	this.cur_time = 1;
	this.links = {};
	this.server = null;

	this.onConnect = function(ws) {
		var player = new Player();
		player.ws = ws;
		player.game = this;
		this.links[ws.id] = player;
		this.players.push(player);

		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if (player.ws.id === ws.id) {
				ws.send(JSON.stringify({"type": "init", "time": this.cur_time, "id": player.ws.id}), {binary: true});
				console.log('send init')
			} else{
				// TODO to event? or from client it's should be?
				ws.send(JSON.stringify({"type": "create", "time": this.cur_time, "entity": "player", "id": player.ws.id}), {binary: true});
				player.ws.send(JSON.stringify({"type": "create", "time": this.cur_time, "entity": "player", "id": ws.id}), {binary: true});
				console.log('send create')
			}
		}
	};

	this.onMessage = function(ws, msg) {
		this.links[ws.id].onMessage(ws, msg);
	};

	this.onDisconnect = function(ws) {
		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if (player.ws.id !== ws.id) {
				// TODO: to event?
				player.ws.send(JSON.stringify({"type": "remove", "time": this.cur_time, "entity": "player", "id": ws.id}), {binary: true});
			}
		}

		this.players.splice(this.players.indexOf(this.links[ws.id]), 1)
	};

	this.update = function(dt) {
		this.cur_time += dt * 1000;
		this.players.forEach(function(player) {
			player.update(dt);
		});
	};

	this.sendToAll = function(json_message, exclude) {
		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if (exclude) {
				if (player.ws !== exclude) {
					player.ws.send(JSON.stringify(json_message), {binary: true});
				}
			} else { 
				player.ws.send(JSON.stringify(json_message), {binary: true});
			}
		}
	};

	this.sendSnapshot = function() {
		console.log("Send snapshot. Cur time: " + this.cur_time);

		var playerUpdateInfo = []
		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			playerUpdateInfo.push({"x": player.pos.x, "y": player.pos.y, "bowAngle": player.bowAngle, "id": player.ws.id});
		}

		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			player.ws.send(JSON.stringify({"type": "update", "time": this.cur_time, "list": playerUpdateInfo}), {binary: true});
		}
	};
};