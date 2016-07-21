var Arrow = require('./arrow');

module.exports = function() {
	this.pos = {x: 0, y: 0};
	this.acceleration = 100;
	this.friction = 0;
	this.velocity = {x: 0, y: 0};
	this.bowAngle = 0;
	this.input = {"u": false, "d": false, "l": false, "r": false};
	this.unhandled_messages = [];
	this.game = arguments[0]

	this.onConnect = function(ws) {

	};

	this.onMessage = function(ws, msg) {
		if (msg["type"] === "interval") {
			for (var i = 0; i < msg["data"].length; i++){
				msg["data"][i]["time"] -= msg["start_time"];
				this.unhandled_messages.push(msg["data"][i]);
			}
		}
	};

	this.handleMessage = function(ws, msg) {
		if (msg["type"] === "input") {
			if (msg.side) this.input[msg.side] = msg.action == "press";
			if (msg.bowAngle) this.bowAngle = msg.bowAngle;
			if (msg.leftpressed) {
				var arrow = new Arrow(this.game);
				arrow.setState(this.pos, this.bowAngle); 
			};
		} 
	};

	this.handleMessagesDelay = function(dt) {
		for (var i = 0; i < this.unhandled_messages.length; i++) {
			var message = this.unhandled_messages[i];
			message["time"] -= dt * 1000;
			if (message["time"] <= 0) {
				this.handleMessage(this.ws, message);
			}
		}

		this.unhandled_messages = this.unhandled_messages.filter(function(m) { return m["time"] > 0;} );
	};

	this.onDisconnect = function(ws) {

	};

	this.handleInput = function(dt) {
		if (this.input["u"]) {
			this.velocity.y += this.acceleration * dt;
		}
		if (this.input["d"]) {
			this.velocity.y -= this.acceleration * dt;
		}
		if (this.input["r"]) {
			this.velocity.x += this.acceleration * dt;
		}
		if (this.input["l"]) {
			this.velocity.x -= this.acceleration * dt;
		}
	};

	this.updatePosition = function(dt) {
		this.pos.x += this.velocity.x;
 		this.pos.y += this.velocity.y;
 
 		this.velocity.x *= 0;
 		this.velocity.y *= 0;
	};


	this.update = function(dt) {
		this.handleMessagesDelay(dt);
		this.handleInput(dt);
		this.updatePosition();
	};
};
