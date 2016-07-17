module.exports = function() {
	this.pos = {x: 0, y: 0};
	this.acceleration = 60;
	this.friction = 0;
	this.velocity = {x: 0, y: 0};

	this.input = {"u": false, "d": false, "l": false, "r": false};

	this.onConnect = function(ws) {

	};

	this.onMessage = function(ws, msg) {
		if (msg["type"] === "input") {
			this.input[msg.side] = msg.action == "press";
		} 
	};

	this.onDisconnect = function(ws) {

	};

	this.update = function(dt) {
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

		this.velocity.x *= this.friction;
		this.velocity.y *= this.friction;

		console.log(this.pos);
	};
};
