// Author: Jeremias Möller
class LargeSnowball extends Projectile {
	static SPEED = 200;
	static IMG_ID = "LARGE_SNOWBALL_SPRITE";
	static LIFESPAN = 5;
	static RADIUS = 90 ;
	static DAMAGE = 2;

	
	constructor(posX, posY, directionX, directionY, lifespan) {
		super(posX, posY, directionX, directionY, LargeSnowball.SPEED, LargeSnowball.IMG_ID, lifespan, LargeSnowball.DAMAGE)
	}
	
	update(duration) {
		this.lifespan -= duration;
		if (this.lifespan <= 0) {
			this.handleHit () ;
			return;
		}
		this.move (duration) ;
		this.display () ;
	}
	
	handleHit() {
		let ctx = Projectile.cv.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.posX, this.posY, LargeSnowball.RADIUS, 0, 2*Math.PI);
		ctx.stroke();
		this.playHitSound();
		for(let enemy of Projectile.enemies) {
			if (Math.sqrt ((this.posX - enemy.posX)**2 + (this.posY - enemy.posY)**2) < LargeSnowball.RADIUS) {
				enemy.handleHit (this.damage) ;
			}
		}
		this.destructor () ;
	}
}