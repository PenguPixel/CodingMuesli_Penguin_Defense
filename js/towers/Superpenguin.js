// Author Jeremias Möller
class Superpenguin extends Tower {
	static RANGE = 300;
	static ATTACK_SPEED = 0.17;
	static IMG_ID = "SUPERPENGUIN_SPRITE";
	static PROJECTILE = Laser;
	static HITBOX_RADIUS = 24;
	//static DESC = 'Schießt Laser Projektile mit hoher Feuerrate' ;
	static COST = 700;
	static _DESCS = {
		"German":	"Schießt Laser Projektile mit hoher Feuerrate",
		"English":	"Shoots laser projectiles with high fire rate"
	};
	static get DESC() {
		let desc = Superpenguin._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Superpinguin",
		"English":	"Superpenguin"
	}
	static get NAME() {
		let name = Superpenguin._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, Superpenguin.RANGE, Superpenguin.ATTACK_SPEED, Superpenguin.IMG_ID, Superpenguin.PROJECTILE, Superpenguin.HITBOX_RADIUS);
	}
}