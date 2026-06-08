// Author: Jeremias Möller
class Icespike extends Projectile {
	static SPEED = 1000;
	static IMG_ID = "ICESPIKE_SPRITE";
	static LIFESPAN = 5;
	static DAMAGE = 1;
	static SLOWDOWN = 0.7;
	static SLOWDOWN_TIMER = 1.2;
	
	statecounter ;	// current stage of split up. Goes down by one every split up until it reaches 0 and can't split up anymore
	hitEnemies ;	// list of already hit enemies to prevent doubele-hits
	// slowdown by Timo Lauterbach
	slowdownTimer;	// amount of seconds that enemies get slowed down upon being hit by this projectile

	constructor(posX, posY, directionX, directionY, damage = Icespike.DAMAGE, statecounter = 2, hitEnemies = [], slowdownTimer = Icespike.SLOWDOWN_TIMER) {
		super(posX, posY, directionX, directionY, Icespike.SPEED, Icespike.IMG_ID, Icespike.LIFESPAN, damage)
		this.statecounter = statecounter ;
		this.hitEnemies = hitEnemies ;
		this.slowdownTimer = slowdownTimer;
	}
	
	handleHit () {
		if (this.statecounter > 0) {
			let angle = Util.getAngle (this.directionX, this.directionY) ;
			let degree = angle / (Math.PI*2) * 360 ;
			let random = Math.random () *60 ;
			let newdegree = random -30 ;
			newdegree = degree + newdegree ;
			if (newdegree > 360) {
				newdegree = newdegree-360 ;
			}
			if (newdegree < 0) {
				newdegree = newdegree+360 ;
			}
			let newangle = newdegree * (Math.PI*2) / 360 ;
			let dir = Util.getDirection (newangle) ;
			
			let random2 = Math.random () *60 ;
			let newdegree2 = random2 -30 ;
			newdegree2 = degree + newdegree2 ;
			if (newdegree2 > 360) {
				newdegree2 = newdegree2-360 ;
			}
			if (newdegree2 < 0) {
				newdegree2 = newdegree2+360 ;
			}
			let newangle2 = newdegree2 * (Math.PI*2) / 360 ;
			let dir2 = Util.getDirection (newangle2) ;
			new Icespike (this._posX, this._posY, dir [0], dir [1], this.damage * 0.5, this.statecounter -1, this.hitEnemies.slice (), this.slowdownTimer*0.75) ;
			new Icespike (this._posX, this._posY, dir2 [0], dir2 [1], this.damage * 0.5, this.statecounter -1, this.hitEnemies.slice (), this.slowdownTimer*0.75) ;
		}
		this.playHitSound();
		this.destructor () ;
	}	

	checkHit() {
	for(let enemy of Projectile.enemies) {
		// checks if enemy has already been hit yet first
		if(this.hitEnemies.indexOf(enemy) == -1 && this.posX >= enemy.left && this.posX <= enemy.right && this.posY >= enemy.top && this.posY <= enemy.bottom) {
			this.hitEnemies.push(enemy);
			return enemy;
			}
		}
	}
	
	update(duration) {
		this.lifespan -= duration;
		if(this.lifespan <= 0) { this.destructor(); return; }
		this.move(duration);
		this.display();
		let enemy = this.checkHit();
		if(enemy) {
			if(enemy.slowdown > Icespike.SLOWDOWN) {
				enemy.slowdown = Icespike.SLOWDOWN;
			} if(enemy.slowInterval < this.slowdownTimer) {
				enemy.slowInterval = this.slowdownTimer;
			}
			enemy.handleHit(this.damage);
			this.handleHit();
		}
	}
}

	

