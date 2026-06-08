// Autor: Jeremias Möller
class Catapult extends Tower {
	static RANGE = 350;
	static ATTACK_SPEED = 3;
	static IMG_ID = "CATAPULT_SPRITE";
	static PROJECTILE = LargeSnowball;
	static HITBOX_RADIUS = 30;
	//static DESC = 'Schleudert ein großes, langsames Geschoss mit Flächenschaden. Trifft mehrere Gegner auf einmal und ist besonders stark gegen Gruppen.';
	static COST = 300;
	static _DESCS = {
		"German":	"Schleudert ein großes, langsames Geschoss mit Flächenschaden. Trifft mehrere Gegner auf einmal und ist besonders stark gegen Gruppen.",
		"English":	"Slings a big, slow snowball with area damage. Hits multiple enemies at once and is especially strong against big clusters of enemies."
	};
	static get DESC() {
		let desc = Fisher._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Katapult",
		"English":	"Catapult"
	}
	static get NAME() {
		let name = Catapult._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}
	
	constructor(posX = 0, posY = 0) {
		super(posX, posY, Catapult.RANGE, Catapult.ATTACK_SPEED, Catapult.IMG_ID, Catapult.PROJECTILE, Catapult.HITBOX_RADIUS);
	}
	shoot(duration, enemy) {
		if(this.lastShot > this.attackSpeed) {
			let lifespan = (Math.sqrt ((this.posX - enemy.posX)**2 + (this.posY - enemy.posY)**2) / LargeSnowball.SPEED)//enemy.posX == this.SPEED && enemy.posY == this.SPEED; //TODO
			new this.Projectile(this.posX, this.posY, this.facingX, this.facingY, lifespan);
			this.lastShot = 0;
			this.playThrowSound();
		}
	}
	update(duration) {
		if(this.isPlaced){
			this.lastShot += duration;
			let enemy = this.checkForEnemy();
			if(enemy) {
				this.faceEnemy(enemy);
				this.shoot(duration, enemy);
			}
		} else {
			this.checkPlacement();
		}
		this.display();
	}
}