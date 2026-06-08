// Author: Timo Lauterbach
class Projectile {
	
	static projectiles = [];
	static enemies = [];
	static cv;
	static DEFAULT_SPEED = 100;
	static DEFAULT_IMG_ID = "SNOWBALL_SPRITE";
	static DEFAULT_LIFESPAN = 1;
	static DEFAULT_DAMAGE = 100;
	static hitAudio1;
	static hitAudio2;
	
	_posX; _posY;
	directionX; directionY;
	speed;
	img;
	lifespan;
	damage;
	hitAudio;
	
	constructor(posX, posY, directionX, directionY, speed = Projectile.DEFAULT_SPEED, imgID = Projectile.DEFAULT_IMG_ID, lifespan = Projectile.DEFAULT_LIFESPAN, damage = Projectile.DEFAULT_DAMAGE) {
		this.directionX = directionX; this.directionY = directionY;
		this.speed = speed;
		this.lifespan = lifespan;
		this.img = document.getElementById(imgID);
		this.posX = posX; this.posY = posY;
		this.damage = damage;
		Projectile.projectiles.push(this);
		this.hitAudio = document.createElement("audio");
		if(Math.random() < 0.4) {
			this.hitAudio.src = Projectile.hitAudio1.src;
			this.hitAudio.volume = Projectile.hitAudio1.volume;
		} else {
			this.hitAudio.src = Projectile.hitAudio2.src;
			this.hitAudio.volume = Projectile.hitAudio2.volume;
		}
	}
	
	display() {
		let ctx = Projectile.cv.getContext("2d");
		let angle = Util.getAngle(this.directionX, this.directionY);
		ctx.translate(this.posX, this.posY);
		ctx.rotate(angle + Math.PI/2);
		ctx.drawImage(this.img, -this.img.width, -this.img.height, this.img.width*2, this.img.height*2);
		// reset transformations to standard
		ctx.setTransform(1, 0, 0, 1, 0, 0);	
	}
	
	// iterates through all enemies to check if it is within one's hitbox. Returns that enemy in that case
	checkHit() {
		for(let enemy of Projectile.enemies) {
			if(this.posX >= enemy.left && this.posX <= enemy.right && this.posY >= enemy.top && this.posY <= enemy.bottom) {
				return enemy;
			}
		}
		return null;
	}
	
	move(duration) {
		this._posX += duration * this.speed * this.directionX;
		this._posY += duration * this.speed * this.directionY;
	}
	
	playHitSound() {
		if(this.hitAudio.paused) {
			Audiohandler.requestAudio(this.hitAudio);
		}
	}
	
	// handles what happens if an enemy gets hit by this
	handleHit() {
		this.destructor();
		this.playHitSound();
	}
	
	// gets called every frame
	update(duration) {
		this.lifespan -= duration;
		if(this.lifespan <= 0) { this.destructor(); return; }
		this.move(duration);
		this.display();
		let enemy = this.checkHit();
		if(enemy) {
			enemy.handleHit(this.damage);
			this.handleHit();
		}
	}
	
	// removes this from the list of projectiles so it doesn't get updated anymore
	destructor() {
		Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
	}
	
	// Getter & Setter
	get posX() { return this._posX + this.img.width; }
	get posY() { return this._posY + this.img.height; }
	set posX(x) { this._posX = Math.round(x - this.img.width); }
	set posY(y) { this._posY = Math.round(y - this.img.height); }
}