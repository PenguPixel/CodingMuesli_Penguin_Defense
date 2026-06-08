// Autor: Timo Lauterbach
class Penguin extends Tower {
	static RANGE = 250;
	static ATTACK_SPEED = 0.55;
	static IMG_ID = "PENGUIN_SPRITE";
	static PROJECTILE = Snowball;
	static HITBOX_RADIUS = 22;
	//static DESC = 'Wirft einfache Schneebälle auf Gegner. Zuverlässig und gut für den Start.';
	static COST = 80;
	static _DESCS = {
		"German":	"Wirft einfache Schneebälle auf Gegner. Zuverlässig und gut für den Start.",
		"English":	"Throws simple snowballs at the enemies. Reliable and good for the start."
	};
	static get DESC() {
		let desc = Penguin._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Schneeballwerfer",
		"English":	"Snowball Thrower"
	}
	static get NAME() {
		let name = Penguin._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, Penguin.RANGE, Penguin.ATTACK_SPEED, Penguin.IMG_ID, Penguin.PROJECTILE, Penguin.HITBOX_RADIUS);
	}
}