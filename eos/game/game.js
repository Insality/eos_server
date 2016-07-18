var Player = require('./player');

module.exports = function() {
	this.players = [];
	this.cur_tick = 1;
	this.links = {};

	this.onConnect = function(ws) {
		var player = new Player();
		this.links[ws.id] = player;
		this.players.push(player);
		ws.send(JSON.stringify({"type": "init", "tick": this.cur_tick}), {binary: true});
	};

	this.onMessage = function(ws, msg) {
		this.links[ws.id].onMessage(ws, msg);
	};

	this.onDisconnect = function(ws) {
		this.players.splice(this.players.indexOf(this.links[ws.id]), 1)
	};

	this.update = function(dt) {
		this.cur_tick += 60 * dt;
		this.players.forEach(function(player) {
			player.update(dt);
		});
	};
};