// Autor: Timo Lauterbach
class IceMage extends Tower {
	static RANGE = 300;
	static ATTACK_SPEED = 1;
	static IMG_ID = "ICE_MAGE_SPRITE";
	static PROJECTILE = Icespike;
	static HITBOX_RADIUS = 22;
	//static DESC = 'Schleudert Eiszapfen, die sich nach einem Treffer teilen. Trifft so mehrere Gegner hintereinander. Verlangsamt außerdem Gegner die er trifft.';
	static COST = 175;
	static _DESCS = {
		"German":	"Schleudert Eiszapfen, die sich nach einem Treffer teilen. Trifft so mehrere Gegner hintereinander. Verlangsamt außerdem Gegner die er trifft.",
		"English":	"Throws ice spikes that split up after a hit. Hits multiple enemies in succession. Also slows down enemies."
	};
	static get DESC() {
		let desc = IceMage._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Eismagier",
		"English":	"Ice Mage"
	}
	static get NAME() {
		let name = IceMage._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, IceMage.RANGE, IceMage.ATTACK_SPEED, IceMage.IMG_ID, IceMage.PROJECTILE, IceMage.HITBOX_RADIUS);
	}
}