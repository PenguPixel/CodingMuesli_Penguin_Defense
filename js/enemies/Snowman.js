// Author: Timo Lauterbach
class Snowman extends Enemy {
	static SPEED = 80;
	static HP = 4;
	static REWARD = 1;
	static IMG_ID = "SNOWMAN_SPRITESHEET";
	static FPS = 12;
	static DAMAGE = 1;
	
	constructor(posX, posY, path) {
		super(posX, posY, path, Snowman.SPEED, Snowman.HP, Snowman.REWARD, Snowman.IMG_ID, Snowman.FPS, Snowman.DAMAGE);
	}
}