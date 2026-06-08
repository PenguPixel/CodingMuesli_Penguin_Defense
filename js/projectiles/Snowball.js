// Author: Timo Lauterbach
class Snowball extends Projectile {
	static SPEED = 800;
	static IMG_ID = "SNOWBALL_SPRITE";
	static LIFESPAN = 5;
	static DAMAGE = 1;
	
	constructor(posX, posY, directionX, directionY) {
		super(posX, posY, directionX, directionY, Snowball.SPEED, Snowball.IMG_ID, Snowball.LIFESPAN, Snowball.DAMAGE)
	}
}