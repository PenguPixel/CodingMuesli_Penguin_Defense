// Author:	Timo Lauterbach
//			Volodymyr Velychko - Money
class Enemy {
	static cv;
	static DEFAULT_SPEED = 10;
	static DEFAULT_HP = 1;
	static DEFAULT_IMG_ID = "SNOWMAN_SPRITESHEET";
	static DEFAULT_FPS = 60;
	static DEFAULT_REWARD = 0;
	static DEFAULT_PENALTY = 0; // penalty when enemy escapes
	static DEFAULT_DAMAGE = 1;
	
	_posX; _posY;
	facingX; facingY;
	path;
	speed;
	hp;
	reward;
	level;
	img; width;	// width of a single frame's sprite
	currentFrame = 0;
	animInterval = 0;	// time passed since the last animation frame update
	fps;
	slowdown = 1;
	slowInterval = 0;
	
	
	constructor(posX, posY, path, speed = Enemy.DEFAULT_SPEED, hp = Enemy.DEFAULT_HP, reward = Enemy.DEFAULT_REWARD, imgID = Enemy.DEFAULT_IMG_ID, fps = Enemy.DEFAULT_FPS, damage = Enemy.DEFAULT_DAMAGE) {
		this.facingX = 0; this.facingY = 1;
		this.path = path;
		this.progress = 0;
		this.speed = speed;
		this.hp = hp;
		// Volodymyr:
		if(reward === Enemy.DEFAULT_REWARD) {
			reward = Math.max(1, Math.floor((hp + speed) / 2));
		}
		this.reward = reward;
		// default penalty equals reward unless overridden
		this.penalty = Math.ceil(this.reward / 2);
		// :Volodymyr
		this.img = document.getElementById(imgID);
		this.posX = posX; this.posY = posY;	
		this.width = parseInt(this.img.alt);	// the alt attribute holds information about the sprite's width
		this.fps = fps;
		this.damage = damage;

	}
	
	display(duration) {
		// change current frame if enough time has passed
		this.animInterval += duration;
		if(this.animInterval >= 1/this.fps) { this.currentFrame++; this.animInterval = 0; }
		//display current frame
		let ctx = Enemy.cv.getContext("2d");
		let angle = Util.getAngle(this.facingX, this.facingY);
		ctx.translate(Math.round(this.posX), Math.round(this.posY));
		ctx.rotate(angle - Math.PI/2);
		ctx.drawImage(this.img, (this.width*this.currentFrame)%this.img.width, 0, this.width, this.img.height, 				// gets sprite of current frame and
								-this.width, -this.img.height, this.width*2, this.img.height*2);	// puts it centered on the enemy's position
		// reset transformations to standard
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	
	move(duration) {
		this.progress += duration * this.speed * this.slowdown;
		let newPos = this.path.getPoint(this.progress);	// use width/2 and height/2 to center the enemy on the path
		this.posX = newPos[0];
		this.posY = newPos[1];
		this.facingX = newPos[2];
		this.facingY = newPos[3];
		// detect leaving the map
		if(this.path.isAtEnd(this.progress)) {
			if(this.level.health > 0) {
				this.level.health -= this.damage;
				if(this.level.health < 0) { this.level.health = 0; }
			}
			this.destructor();
			return false;
		}
		return true;
	}
	
	// handle the behaviour when getting hit
	handleHit(damage = Projectile.DEFAULT_DAMAGE) {
		this.hp -= damage;
		if(this.hp <= 0) {
			this.onDeath();	// :from Volodymyr
			this.destructor();
		}
	}
	
	
	onDeath() {								// :from Volodymyr
		if (this.level && typeof this.level.addMoney === "function") {
			this.level.addMoney(this.reward);
		} else if (Enemy.onKill) {
			Enemy.onKill(this.reward);
		}
	}
	
	// removes this enemy from the enemies list to stop it getting updates
	//The method is intentionally defensive: the enemy may not be attached to a
	//level (for example if it was never spawned or has already been removed),
	//and it is possible for destructor() to be called more than once during
	//cleanup (onDeath -> destructor, onEscape -> destructor, etc.).  To avoid any
	//runtime errors we first check that `this.level` exists, then look up the
	//current index of `this` in the array.  If the enemy is not found we simply
	//bail out.  Using `indexOf` + `splice` keeps the operation in-place and
	//avoids allocating a new array, which is fine given typical wave sizes.
	//This approach also makes repeated calls to destructor() harmless.				:from Volodymyr
	destructor() {
		// Kontrolllogik von Volodymyr
		if (this.level) {
			const i = this.level.enemies.indexOf(this);
			if (i !== -1) {
				// remove only if still present, otherwise leave the array intact
				this.level.enemies.splice(i, 1);
			}
		}
	}
	
	update(duration) {
		let inMap = this.move(duration);
		if(inMap) {
			this.display(duration);
		}
		if(this.slowInterval > 0) {
			this.slowInterval -= duration;
			if(this.slowInterval <= 0) {
				this.slowdown = 1;
			}
		}
	}
	
	// Getter & Setter
	get posX() { return Math.round(this._posX) + this.width; }
	get posY() { return Math.round(this._posY) + this.img.height; }
	set posX(x) { this._posX = Math.round(x - this.width); }
	set posY(y) { this._posY = Math.round(y - this.img.height); }
	// Definition of hitboxes:
	get left() { return this.posX - this.width; }
	get right() { return this.posX + this.width; }
	get top() { return this._posY; }
	get bottom() { return this._posY + this.img.height*2; }
}