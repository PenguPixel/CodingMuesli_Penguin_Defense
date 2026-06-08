// Author: Timo Lauterbach
class Yeti extends Enemy {
	static SPEED = 56;
	static HP = 17;
	static REWARD = 2;
	static IMG_ID = "YETI_SPRITESHEET";
	static FPS = 5;
	static DAMAGE = 4;
	
	constructor(posX, posY, path) {
		super(posX, posY, path, Yeti.SPEED, Yeti.HP, Yeti.REWARD, Yeti.IMG_ID, Yeti.FPS, Yeti.DAMAGE);
	}
}