// Author: Timo Lauterbach
class Trouterang extends Projectile {
	static SPEED = 800;
	static IMG_ID = "TROUTERANG_SPRITE";
	static LIFESPAN = 50;
	static DAMAGE = 0.8;
	//static MAX_HITS = 10;
	
	curving = false;
	curveScaling = 0;
	static FPS = 60;	// the curving is dependant on the frame rate so I'll have to set it in relation with a set frame rate
	tower;
	hitEnemies = [];
	rotationAngle = 0;

	constructor(posX, posY, directionX, directionY, tower, damage = Trouterang.DAMAGE) {
		super(posX, posY, directionX, directionY, Trouterang.SPEED, Trouterang.IMG_ID, Trouterang.LIFESPAN, damage)
		this.tower = tower;
	}
	
	display() {
		let ctx = Projectile.cv.getContext("2d");
		let angle = this.rotationAngle % (Math.PI * 2);
		ctx.translate(this.posX, this.posY);
		ctx.rotate(angle + Math.PI/2);
		ctx.drawImage(this.img, -this.img.width, -this.img.height, this.img.width*2, this.img.height*2);
		// reset transformations to standard
		ctx.setTransform(1, 0, 0, 1, 0, 0);	
	}
	
	// change direction towards the tower
	curve(duration) {
		/* ratio makes sure different framerates don't produce different results. Since every frame the current angle gets changed by an amount depending on
		the curveScaling and the curveScaling gets increase every frame, one frame with the duration of 0.05 results in an angle change of 0.05 towards the tower
		while with a frame rate three times as high 0.05 seconds have three frames of duration 0.017 which results in a change of 0.017 + 0.034 + 0.051 so roughly
		double the amount of change, which means lower frame rates result in much wider arcs.*/
		let ratio = duration * Trouterang.FPS;
		/*let fpsScaling;
		if(ratio < 1) {
			fpsScaling = 2 / ((1/ratio)+1);
		} else {
			fpsScaling = (ratio+1) / 2;
		}*/
		// curveScaling makes it so the projectile has a smooth transition into a curve at first but ends up with a straight line towards the tower eventually
		this.curveScaling += ratio * duration/7;
		if(this.curveScaling > 1) { this.curveScaling = 1; }
		// calculates the shorter angle between the current angle and the direct line to the tower and adds or subtracts a part of that difference to the current angle
		let currentAngle = Util.getAngle(this.directionX, this.directionY);
		if(currentAngle < 0) { currentAngle += 2*Math.PI; }
		let goalDir = Util.normalise(this.tower.posX - this.posX, this.tower.posY - this.posY);
		let goalAngle = Util.getAngle(goalDir[0], goalDir[1]);
		if(goalAngle < 0) { goalAngle += 2*Math.PI; }
		let diff = goalAngle - currentAngle;
		if(diff > Math.PI) { diff -= 2*Math.PI; }
		else if(diff < -Math.PI) { diff += 2*Math.PI; }
		let newAngle = (currentAngle + this.curveScaling * diff);
		if(newAngle < 0) { newAngle += 2*Math.PI; }
		else if(newAngle > 2*Math.PI) { newAngle -= 2*Math.PI; }
		// sets the direction to the newly calculated angle
		let newDir = Util.getDirection(newAngle);
		this.directionX = newDir[0];
		this.directionY = newDir[1];
	}
	
	
	checkHit() {
		for(let enemy of Projectile.enemies) {
			if(this.posX >= enemy.left && this.posX <= enemy.right && this.posY >= enemy.top && this.posY <= enemy.bottom
				&& !this.hasEnemyBeenHit(enemy)) {
				return enemy;
			}
		}
		return null;
	}
	
	handleHit() {
		this.curving = true;
		this.playHitSound();
	}
	
	hasEnemyBeenHit(enemy) {
		for(let i = 0; i < this.hitEnemies.length; i++) {
			if(this.hitEnemies[i][0] == enemy) { return true; }
		}
		return false;
	}
	
	updateHitEnemies(duration) {
		for(let entry of this.hitEnemies) {
			entry[1] -= duration;
			if(entry[1] <= 0) {
				this.hitEnemies.splice(this.hitEnemies.indexOf(entry), 1);
			}
		}
	}
	
	update(duration) {
		if(this.curving && Util.getDistance([this.posX, this.posY], [this.tower.posX, this.tower.posY]) < this.tower.hitboxRadius) {
				this.destructor();
				return;
		}
		if(Util.getDistance([this.posX, this.posY], [this.tower.posX, this.tower.posY]) > this.tower.range) { this.curving = true; }
		this.move(duration);
		this.display();
		let enemy = this.checkHit();
		while(enemy && !this.hasEnemyBeenHit(enemy)) {
			enemy.handleHit(this.damage);
			this.handleHit();
			this.hitEnemies.push([enemy, 0.5]);	// the same enemy will not be able to be hit for half a second, preventing hits every frame, but enabling hits on the way back to the tower
			enemy = this.checkHit();	// since this projectile has pierce, hit every possible enemy, not just one
		}
		if(this.curving) { this.curve(duration); }
		this.updateHitEnemies(duration);
		this.rotationAngle = (this.rotationAngle - 10*duration * Math.PI) % (Math.PI * 2);
	}
	
	destructor() {
		super.destructor();
		this.tower.canShoot++;
		this.tower.lastShot = 0;
	}
	
}