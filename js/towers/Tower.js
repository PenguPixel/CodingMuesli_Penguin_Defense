// Author: Timo Lauterbach
class Tower {
	_posX; _posY;
	damage = 0; // TODO
	range = 0;			// in pixels
	attackSpeed = 1;	// cooldown in seconds
	facingX = 0; facingY = 1;	// direction the tower is facing, to be interpreted as normalised vector
	img;
	Projectile;	// class of the projectile
	lastShot = 0; // duration since last shot in seconds
	selected = false;
	validPlacement = false;
	isPlaced = false;
	hitboxRadius = 0;
	validTiles = ["G"];
	throwAudio1;
	throwAudio2;
	
	// Setting default values and shared variables for all instances
	static DEFAULT_IMG_ID = "PENGUIN_SPRITE";
	static DEFAULT_PROJECTILE = Projectile;
	static DEFAULT_HITBOX_RADIUS = 32;
	static DEFAULT_DESC = "No text found.";
	static DEFAULT_NAME = "Name not found.";
	static enemies = [];
	static towers = [];
	static cv;
	static level;
	static throwAudio1;
	static throwAudio2;
	
	constructor(posX = 0, posY = 0, range = 0, attackSpeed = 1, img = Tower.DEFAULT_IMG_ID, Projectile = Tower.DEFAULT_PROJECTILE, hitboxRadius = Tower.DEFAULT_HITBOX_RADIUS, validTiles = ["G"]) {
		this.range = range;
		this.attackSpeed = attackSpeed;
		this.img = document.getElementById(img);
		this.posX = posX; this.posY = posY;
		this.Projectile = Projectile;
		this.hitboxRadius = hitboxRadius;
		this.validTiles = validTiles;
		this.throwAudio1 = document.createElement("audio");
		this.throwAudio1.src = Tower.throwAudio1.src;
		this.throwAudio1.volume = Tower.throwAudio1.volume;
		this.throwAudio2 = document.createElement("audio");
		this.throwAudio2.src = Tower.throwAudio2.src;
		this.throwAudio2.volume = Tower.throwAudio2.volume;
	}
	
	display() {
		let ctx = Tower.cv.getContext("2d");
		let angle = Util.getAngle(this.facingX, this.facingY);
		// move "origin" of canvas to the middle of the sprite and rotate
		ctx.translate(this.posX, this.posY);
		ctx.rotate(angle - Math.PI/2);
		ctx.drawImage(this.img, -this.img.width, -this.img.height, this.img.width*2, this.img.height*2);
		// reset transformations to standard
		ctx.setTransform(1, 0, 0, 1, 0, 0);	
		if(this.selected) { this.showStats(); }
	}
	
	static getBubbleSummaryLines(tower) {
		let lines = [];
		let statNames = ["Range", "Speed"];
		let stats =	[tower.range, Math.round(tower.attackSpeed*100)/100];
		for(let i = 0; i < statNames.length; i++) {
			let tmp = Languages.statSummary(statNames[i]);
			tmp += stats[i];
			lines.push(tmp);
		}
		return lines;
	}
	
	showStats() {
		let ctx = Tower.cv.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.posX, this.posY, this.range, 0, 2*Math.PI);
		ctx.stroke();
		if(!this.validPlacement) {
			ctx.save();
			ctx.fillStyle = "#ff000030";
			ctx.fill();
			ctx.restore();
		}
		let lines = Tower.getBubbleSummaryLines(this);
		let bubbleWidth = 0;
		ctx.save();
		ctx.font = Ui.fontSize;
		for(let line of lines) {
			let w = ctx.measureText(line).width;
			if(w > bubbleWidth) bubbleWidth = w;
		}
		bubbleWidth += 2 * Ui.padding;
		ctx.restore();
		let bubbleHeight = Ui.getBubbleHeightFromLines(lines);
		Ui.drawBubble(ctx, this._posX, this._posY, bubbleWidth, bubbleHeight);
		Ui.drawBubbleLines(ctx, lines, this._posX, this._posY, bubbleHeight);
	}
	
	// Turn towards the targeted enemy and normalise the vector
	faceEnemy(enemy) {
		let normalised = Util.normalise(enemy.posX - this.posX, enemy.posY - this.posY);
		this.facingX = normalised[0];
		this.facingY = normalised[1];
	}
	
	// iterate through the array of enemies to check if one is within the radius
	checkForEnemy() {
		for(let enemy of Tower.enemies) {
			let directionX = enemy.posX - this.posX;
			let directionY = enemy.posY - this.posY;
			if(Math.sqrt(directionX**2 + directionY**2) <= this.range) {
				return enemy;
			}
		}
		return null;
	}
	
	playThrowSound() {
		if(!(this.throwAudio1.paused && this.throwAudio2.paused)) { return; }
		let tmp = Math.random();
		if(tmp < 0.5) {
			Audiohandler.requestAudio(this.throwAudio1);
		} else {
			Audiohandler.requestAudio(this.throwAudio2);
		}
	}
	
	// create a new projectile going into the direction the tower is facing if the attack cooldown has ended
	shoot(duration) {
		if(this.lastShot > this.attackSpeed) {
			new this.Projectile(this.posX, this.posY, this.facingX, this.facingY);
			this.lastShot = 0;
			this.playThrowSound();
		}
	}
	
	checkPlacement() {
		// Kopiert von Philipp	-----------------------------------------------------------------------------------------
		let canPos = Tower.cv.getBoundingClientRect();		//ermittelt die genaue Position des Canvas im Browserfenster
		this.posX = (Util.mouseX - canPos.left) / (canPos.width / Tower.cv.width);
		this.posY = (Util.mouseY - canPos.top) / (canPos.height / Tower.cv.height);
		// --------------------------------------------------------------------------------------------------------------
		if(this.posX < 0) this.posX = 0;
		if(this.posY < 0) this.posY = 0;
		if(this.posX >= Tower.cv.width) this.posX = Tower.cv.width-1;
		if(this.posY >= Tower.cv.height) this.posY = Tower.cv.height-1;
		for(let tower of Tower.towers) {
			let minDistance = tower.hitboxRadius + this.hitboxRadius;
			let actDistance = Math.sqrt((tower.posX - this.posX)**2 + (tower.posY - this.posY)**2);
			if(actDistance < minDistance && tower != this) { this.validPlacement = false; return; }
		}
		let tile = Tower.level.getTile(this.posX, this.posY);
		let validTile = true;
		for(let type of tile.getTileTypes()) {
			if(this.validTiles.indexOf(type) == -1) {
				validTile = false;
				break;
			}
		}
		this.validPlacement = validTile && Tower.level.path.isPointPlacable(this.posX, this.posY);
	}
	
	update(duration) {
		if(this.isPlaced) {
			this.lastShot += duration;
			let enemy = this.checkForEnemy();
			if(enemy) {
				this.faceEnemy(enemy);
				this.shoot(duration);
			}
		} else {
			this.checkPlacement();
		}
		this.display();
	}
	
	// Getter and Setter
	
	get posX() { return this._posX + this.img.width; }
	get posY() { return this._posY + this.img.height; }
	set posX(x) { this._posX = Math.round(x - this.img.width); }
	set posY(y) { this._posY = Math.round(y - this.img.height); }
	
	// Static functions for upgrade functionality
	
	static increaseRange(tower, amount, mode) {
		if(mode == "%") {
			tower.range *= 1 + (amount/100);
		} else if(mode == "total") {
			tower.range += amount;
		}
	}
	
	static increaseAttackSpeed(tower, amount, mode) {
		if(mode == "%") {
			tower.attackSpeed /= 1 + (amount/100);
		} else if(mode == "total") {
			tower.attackSpeed -= amount;
		}
	}
	
	static increaseDamage(tower, amount, mode) {
		if(mode == "%") {
			tower.damage *= 1 + (amount/100);
		} else if(mode == "total") {
			tower.damage += amount;
		}
	}
	
	// Philipp Auswahl passender Placement Sound
	static choosePlacementSound(tower) {
		if(tower instanceof Fisher) {
			Audiohandler.requestAudio(Ui.placementAudioWater);
		} else {
			Audiohandler.requestAudio(Ui.placementAudioSnow);
		}
	}
}