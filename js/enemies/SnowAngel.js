// Author: Timo Lauterbach
class SnowAngel extends Enemy {
	static SPEED = 110;
	static HP = 12;
	static REWARD = 2;
	static IMG_ID = "SNOW_ANGEL_SPRITESHEET";
	static FPS = 12;
	static DAMAGE = 5;
	
	constructor(posX, posY, path) {
		super(posX, posY, path, SnowAngel.SPEED, SnowAngel.HP, SnowAngel.REWARD, SnowAngel.IMG_ID, SnowAngel.FPS, SnowAngel.DAMAGE);
	}
	
	get left() { return this.posX - this.width/2; }
	get right() { return this.posX + this.width/2; }
}