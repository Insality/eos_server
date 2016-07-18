var Player = require('./player');

module.exports = function() {
	this.players = [];
	this.cur_tick = 1;
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
				ws.send(JSON.stringify({"type": "init", "tick": this.cur_tick, "id": player.ws.id}), {binary: true});
				console.log('send init')
			} else{
				ws.send(JSON.stringify({"type": "create", "tick": this.cur_tick, "entity": "player", "id": player.ws.id}), {binary: true});
				player.ws.send(JSON.stringify({"type": "create", "tick": this.cur_tick, "entity": "player", "id": ws.id}), {binary: true});
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
				player.ws.send(JSON.stringify({"type": "remove", "tick": this.cur_tick, "entity": "player", "id": ws.id}), {binary: true});
			}
		}

		
		this.players.splice(this.players.indexOf(this.links[ws.id]), 1)
	};

	this.update = function(dt) {

		// console.log(this.cur_tick);

		this.cur_tick += 60 * dt;
		this.players.forEach(function(player) {
			player.update(dt);
		});

		var playerUpdateInfo = []
		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			playerUpdateInfo.push({"x": player.pos.x, "y": player.pos.y, "bowAngle": player.bowAngle, "id": player.ws.id});
		}

		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			player.ws.send(JSON.stringify({"type": "update", "tick": this.cur_tick, "list": playerUpdateInfo}), {binary: true});
		}
	};
};