module.exports = function() {
	this.etype = "arrow";
	this.pos = {x: 0, y: 0};
	this.acceleration = 100;
	this.friction = 0;
	this.velocity = {x: 0, y: 0};
	this.angle = 0;
	this.speed = 100;
	this.lifeTime = 2;
	this.game = arguments[0];
	this.id = this.game.server.getUniqueId();
	this.game.addEntity(this);

	this.setState = function(pos, angle) {
		this.pos = _.clone(pos);
		this.angle = angle;
	};

	this.getInfo = function() {
		return {"angle": this.angle};
	};

	this.updateVelocity = function(dt) {
		var dir_vector = {x: Math.cos(this.angle), y: Math.sin(this.angle)};
		this.velocity.x = dir_vector.x * this.speed * dt;
		this.velocity.y = dir_vector.y * this.speed * dt;
	};

	this.updatePosition = function(dt) {
		this.pos.x += this.velocity.x;
 		this.pos.y += this.velocity.y;
 
 		this.velocity.x *= 0;
 		this.velocity.y *= 0;
	};


	this.updateCollision = function(dt) {
	};

	this.update = function(dt) {
		this.updateVelocity(dt);
		this.updatePosition(dt);
		this.updateCollision(dt);

		this.lifeTime -= dt;
		if (this.lifeTime <= 0) this.game.removeEntity(this);
	};
};
