module.exports = function() {
	this.pos = {x: 0, y: 0};
	this.acceleration = 100;
	this.velocity = {x: 0, y: 0};

	this.init = function() {
	};


	this.updatePosition = function(dt) {
		this.pos.x += this.velocity.x;
 		this.pos.y += this.velocity.y;
 
 		this.velocity.x *= 0;
 		this.velocity.y *= 0;
	};

	this.update = function(dt) {
		this.updatePosition(dt);
	};
};
