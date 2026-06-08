// Autor: Timo Lauterbach
class PineconeGunner extends Tower {
	static RANGE = 320;
	static ATTACK_SPEED = 0.9;
	static IMG_ID = "PINECONE_GUNNER_SPRITE";
	static PROJECTILE = Pinecone;
	static HITBOX_RADIUS = 22;
	//static DESC = 'Wirft Tannenzapfen, die durch mehrere Gegner hindurchfliegen. Trifft viele Feinde auf einmal und ist stark gegen große Gruppen.';
	static COST = 150;
	static _DESCS = {
		"German":	"Wirft Tannenzapfen, die durch mehrere Gegner hindurchfliegen. Trifft viele Feinde auf einmal und ist stark gegen große Gruppen.",
		"English":	"Throws pine cones that pierce enemies. Hits multiple enemies at once and is strong against bigger groups."
	};
	static get DESC() {
		let desc = PineconeGunner._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Zapfenwerfer",
		"English":	"Cone Gunner"
	}
	static get NAME() {
		let name = PineconeGunner._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	extraPierce = 0;
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, PineconeGunner.RANGE, PineconeGunner.ATTACK_SPEED, PineconeGunner.IMG_ID, PineconeGunner.PROJECTILE, PineconeGunner.HITBOX_RADIUS);
	}
	
	shoot(duration) {
		if(this.lastShot > this.attackSpeed) {
			new this.Projectile(this.posX, this.posY, this.facingX, this.facingY).maxHits += this.extraPierce;
			this.lastShot = 0;
			this.playThrowSound();
		}
	}
	
	static increasePierce(tower, amount, mode) {
		if(mode == "total") {
			tower.extraPierce += amount;
		} else {
			console.log("Invalid upgrade mode for PineconeGunner: " + mode);
		}
	}
}