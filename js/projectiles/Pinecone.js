// Author: Timo Lauterbach
class Pinecone extends Projectile {
	
	static SPEED = 900;
	static IMG_ID = "PINECONE_SPRITE";
	static MAX_HITS = 4;
	static LIFESPAN = 5;
	static DAMAGE = 1;
	
	hitCount = 0;		// amount of enemies hit
	hitEnemies = [];	// list of enemies that have already been hit by this projectile to prevent double hits
	maxHits = Pinecone.MAX_HITS;
	
	constructor(posX, posY, directionX, directionY) {
		super(posX, posY, directionX, directionY, Pinecone.SPEED, Pinecone.IMG_ID, Pinecone.LIFESPAN, Pinecone.DAMAGE)
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
		if(this.hitCount == this.maxHits) {
			this.destructor();
		}	
	}
}