// Author: Timo Lauterbach
class IceGolem extends Enemy {
	static SPEED = 40;
	static HP = 70;
	static REWARD = 8;
	static IMG_ID = "ICE_GOLEM_SPRITESHEET";
	static FPS = 5;
	static DAMAGE = 8;
	
	constructor(posX, posY, path) {
		super(posX, posY, path, IceGolem.SPEED, IceGolem.HP, IceGolem.REWARD, IceGolem.IMG_ID, IceGolem.FPS, IceGolem.DAMAGE);
	}
}