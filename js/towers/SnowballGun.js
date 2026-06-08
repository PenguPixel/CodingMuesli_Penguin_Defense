// Autor: Jeremias Möller
class SnowballGun extends Tower {
	static RANGE = 130;
	static ATTACK_SPEED = 1;
	static IMG_ID = "SNOWBALL_GUN_SPRITE";
	static PROJECTILE = Snowball;
	static HITBOX_RADIUS = 30;
	static DEFAULT_LIFESPAN = 1
	//static DESC = 'Schießt gleichzeitig Schneebälle in alle 8 Richtungen. Trifft viele Gegner um sich herum gleichzeitig.';
	static COST = 150;
	static _DESCS = {
		"German":	"Schießt gleichzeitig Schneebälle in alle 8 Richtungen. Trifft viele Gegner um sich herum gleichzeitig.",
		"English":	"Shoots snowballs in 8 directions simultaneously. Hits multiple enemies at once."
	};
	static get DESC() {
		let desc = SnowballGun._DESCS[Languages.language];
		if(desc == undefined) { return Tower.DEFAULT_DESC; }
		return desc;
	}
	static _NAMES = {
		"German":	"Schneekanone",
		"English":	"Snowball Gun"
	}
	static get NAME() {
		let name = SnowballGun._NAMES[Languages.language];
		if(name == undefined) { return Tower.DEFAULT_NAME; }
		return name;
	}

	constructor(posX = 0, posY = 0) {
		super(posX, posY, SnowballGun.RANGE, SnowballGun.ATTACK_SPEED, SnowballGun.IMG_ID, SnowballGun.PROJECTILE, SnowballGun.HITBOX_RADIUS) ;
	}
	
	faceEnemy(enemy) {}
	
	shoot(duration) {
		if(this.lastShot > this.attackSpeed) {
			new this.Projectile(this.posX, this.posY, this.facingX, this.facingY).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, this.facingY, this.facingX).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, -this.facingY, -this.facingX).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, -this.facingX, -this.facingY).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, 1/ Math.sqrt (2), 1/ Math.sqrt (2)).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, -1/ Math.sqrt (2), 1/ Math.sqrt (2)).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, 1/ Math.sqrt (2), -1/ Math.sqrt (2)).lifespan = this.range/Snowball.SPEED;
			new this.Projectile(this.posX, this.posY, -1/ Math.sqrt (2), -1/ Math.sqrt (2)).lifespan = this.range/Snowball.SPEED;
			this.lastShot = 0;
			this.playThrowSound();
		}
	}
}