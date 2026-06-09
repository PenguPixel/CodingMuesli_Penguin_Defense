// Author: Timo Lauterbach
class Fisher extends Tower {
	static RANGE = 300;
	static ATTACK_SPEED = 0.5;
	static IMG_ID = "FISHER_SPRITE";
	static PROJECTILE = Trouterang;
	static HITBOX_RADIUS = 24;
	static VALID_TILES = ["W"];
	//static DESC = "Wirft mit Forellerängen nach Gegnern die immer zu ihm zurückkehren. Kann nur im Wasser platziert werden.";
	static COST = 250;
	static _DESCS = {
		"German":	"Wirft mit Forellerängen nach Gegnern die immer zu ihm zurückkehren. Kann nur im Wasser platziert werden.",
		"English":	"Throws with Trouterangs at enemies that always return to it. Can only be placed in water."
	};
	static get DESC() {
		let desc = Fisher._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Fischer",
		"English":	"Fisher"
	}
	static get NAME() {
		let name = Fisher._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	canShoot = 1;	// can only shoot if a Trouterang has returned to it
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, Fisher.RANGE, Fisher.ATTACK_SPEED, Fisher.IMG_ID, Fisher.PROJECTILE, Fisher.HITBOX_RADIUS, Fisher.VALID_TILES);
	}
	
	shoot(duration) {
		this.lastShot += duration;
		if(this.lastShot > this.attackSpeed && this.canShoot) {
			// TODO: Check if Cook is nearby -> increase damage
			new this.Projectile(this.posX, this.posY, this.facingX, this.facingY, this);
			this.lastShot = 0;
			this.canShoot--;
			this.playThrowSound();
		}
	}
	
	static increaseTrouterangCount(tower) {
		tower.canShoot++;
	}
}