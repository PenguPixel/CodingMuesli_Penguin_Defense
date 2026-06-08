// Author: Jeremias Möller
class Laser extends Projectile {
	static SPEED = 800;
	static IMG_ID = "LASER_SPRITE";
	static MAX_HITS = 5;
	static LIFESPAN = 5;
	static DAMAGE = 0.5;
	
	hitCount = 0;		// amount of enemies hit
	hitEnemies = [];	// list of enemies that have already been hit by this projectile to prevent double hits
	
	constructor(posX, posY, directionX, directionY) {
		super(posX, posY, directionX, directionY, Laser.SPEED, Laser.IMG_ID, Laser.LIFESPAN, Laser.DAMAGE)
	}
	
	checkHit() {
		for(let enemy of Projectile.enemies) {
			// checks if enemy has already been hit yet first
			if(this.hitEnemies.indexOf(enemy) == -1 && this.posX >= enemy.left && this.posX <= enemy.right && this.posY >= enemy.top && this.posY <= enemy.bottom) {
				this.hitEnemies.push(enemy);
				return enemy;
			}
		}
		return null;
	}
	
	handleHit() {
		this.hitCount++;
		this.playHitSound();
		if(this.hitCount == Laser.MAX_HITS) {
			this.destructor();
		}	
	}
}

	