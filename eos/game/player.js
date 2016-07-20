module.exports = function() {
	this.pos = {x: 0, y: 0};
	this.acceleration = 100;
	this.friction = 0;
	this.velocity = {x: 0, y: 0};
	this.bowAngle = 0;
	this.input = {"u": false, "d": false, "l": false, "r": false};
	this.delay = 500;
	this.unhandled_messages = [];

	this.onConnect = function(ws) {

	};

	this.onMessage = function(ws, msg) {
		if (msg["type"] === "interval") {
			for (var i = 0; i < msg["data"].length; i++){
				this.unhandled_messages.push(msg["data"][i]);
				console.log("income message. My time:" + this.game.cur_time + " and msg first time:  " + msg["data"][0]["time"])
			}
		}
	};

	this.handleMessage = function(ws, msg) {
		if (msg["type"] === "input") {
			this.input[msg.side] = msg.action == "press";
		} 

		if (msg["type"] === "create") {
			if (msg["entity"] === "arrow") {
				this.game.sendToAll({"type": "create", "entity": "arrow", "x": this.pos.x, "y": this.pos.y, "angle": this.bowAngle, "id": ws.id}, ws);
			}
		}

		msg["handled"] = true;
	};

	this.handleMessagesDelay = function() {
		for (var i = 0; i < this.unhandled_messages.length; i++) {
			var message = this.unhandled_messages[i];
			if (message["time"] <= this.game.cur_time - this.delay) {
				this.handleMessage(this.ws, message);
			}
		}

		this.unhandled_messages = this.unhandled_messages.filter(function(m) { return !m["handled"];} );

		console.log(this.unhandled_messages.length);
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

		this.pos.x += this.velocity.x;
 		this.pos.y += this.velocity.y;
 
 		this.velocity.x *= 0;
 		this.velocity.y *= 0;
	};

	this.update = function(dt) {
		this.handleMessagesDelay(this.delay);
		this.handleInput(dt);
	};
};
