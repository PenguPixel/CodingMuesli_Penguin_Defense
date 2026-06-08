// Author:	Philipp Locher - static functions
//			Timo Lauterbach - animation and controls
class Ui {
	// Timo	-----------------------------------------------------------
	loading = false;
	nextScene;
	currentFrame = 0;
	static FPS = 20;
	static LOAD_DELAY = 0.5;	// Duration of black screen in seconds
	loadTimer = 0;
	interval = 0;
	inLevel = false;
	gameOverOpacity = -2;
	preLoadData;	// TODO: save the imageData of UI canvas before load, so clearRect can be used and the previous UI can still be loaded to be visible to create a better effect
	loadFadeIn; loadFadeOut; loadWalk;	// animation spritesheets
	currentAnimation;
	// button and stat images
	pauseButton;
	playButton;
	continueButton;
	mainMenuButton;
	healthImg;
	snowImg;
	waveImg;
	winImg; loseImg;
	
	canvas;
	controls;
	darkened = false;
	level;
	//	--------------------------------------------------------------
	// Philipp	------------------------------------------------------
	static fontSize = '20px Pixel';
	static padding = 12;
	static lineHeight = 18;
	static upgradeArrow = null;

	// flags for language control
	static flagENImg_inactive;
	static flagENImg_active;
	static flagGERImg_inactive;
	static flagGERImg_active;
	static flagOffset = 30; //px

	// End screen localization
	static WinGer = "Gewonnen!";
	static LoseGer = "Verloren!";
	static WinEng = "You Win!";
	static LoseEng = "You Lose!";

	// UI Sounds
	static buyAudio;
	static upgradeAudio;
	static placementAudioSnow;
	static placementAudioWater;
	//	-------------------------------------------------------------
	
	// Timo:	------------------------------------------------------------------------------------------------------
	constructor(controls) {
		this.loadFadeIn = document.getElementById("LOAD_FADE_IN");
		this.loadFadeOut = document.getElementById("LOAD_FADE_OUT");
		this.pauseButton = document.getElementById("PAUSE_BUTTON");
		this.playButton = document.getElementById("PLAY_BUTTON");
		this.setLanguageButtons();
		this.healthImg = document.getElementById("HEALTH");
		this.snowImg = document.getElementById("SNOW");
		this.waveImg = document.getElementById("WAVE");
		this.winImg = document.getElementById("WIN");
		this.loseImg = document.getElementById("LOSE");
		this.flagENImg = document.getElementById("FLAG_EN");
		this.flagGERImg = document.getElementById("FLAG_GER");
		this.canvas = document.getElementById("UI");
		this.controls = controls;
		window.addEventListener("click", this.clickButton.bind(this));
	}
	
	setLanguageButtons() {
		this.continueButton = document.getElementById(Languages.button("Continue"));
		this.mainMenuButton = document.getElementById(Languages.button("MainMenu"));
	}
	
	animate(duration) {
		if(!this.currentAnimation) { return; }
		this.interval += duration;
		let width = parseInt(this.currentAnimation.alt);
		let ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.drawImage(this.currentAnimation, this.currentFrame*width, 0, width, this.currentAnimation.height, 0, 0, this.canvas.width, this.canvas.height);
		if(this.interval > 1/Ui.FPS) {
			this.currentFrame++;
			this.interval = 0;
			if(this.currentFrame >= this.currentAnimation.width/width) {
				this.currentAnimation = null;
				this.currentFrame = 0;
				this.loading = false;
			}
		}
	}
	
	// Load different animations
	doLoadingScreen(nextScene) {
		this.nextScene = nextScene;
		this.loading = true;
		this.currentAnimation = this.loadFadeIn;
		this.interval = 0;
		this.loadTimer = 0;
	}
	fadeOutLoad() {
		this.loading = true;
		this.currentAnimation = this.loadFadeOut;
		this.interval = 0;
		this.loadTimer = 0;
	}
	
	// Returns what button is being hovered over
	get mouseOverButton() {
		let canPos = this.canvas.getBoundingClientRect();
		let scaleX = this.canvas.width / canPos.width;
		let scaleY = this.canvas.height / canPos.height;
		let mouseX = (Util.mouseX - canPos.left) * scaleX;
		let mouseY = (Util.mouseY - canPos.top) * scaleY;
		if(this.controls["currentScene"] == "level" && this.controls["paused"]) {
			let continueButtonLeft = this.canvas.width/2 - this.continueButton.width*3;
			let continueButtonTop = this.canvas.height/3 - this.continueButton.height*3;
			if(mouseX > continueButtonLeft && mouseX < continueButtonLeft + this.continueButton.width*6
				&& mouseY > continueButtonTop && mouseY < continueButtonTop + this.continueButton.height*6) {
					return 1;
			}
			
			let menuButtonLeft = this.canvas.width/2 - this.mainMenuButton.width*3;
			let menuButtonTop = this.canvas.height*2/3 - this.mainMenuButton.height*3;
			if(mouseX > menuButtonLeft && mouseX < menuButtonLeft + this.mainMenuButton.width*6
				&& mouseY > menuButtonTop && mouseY < menuButtonTop + this.mainMenuButton.height*6) {
					return 3;
			}

			// add klick behaviour to flags
			let FlagLeft = this.canvas.width - Ui.flagOffset - Ui.flagENImg_inactive.width;
			let engFlagTop = Ui.flagOffset;
			let gerFlagTop = Ui.flagENImg_inactive.height + (2* Ui.flagOffset);
			if(mouseX > FlagLeft && mouseX < FlagLeft + Ui.flagENImg_inactive.width
				&& mouseY > engFlagTop && mouseY < (engFlagTop + Ui.flagENImg_inactive.height)) {
				return 6;
			}
			if(mouseX > FlagLeft && mouseX < FlagLeft + Ui.flagGERImg_inactive.width
				&& mouseY > gerFlagTop && mouseY < (gerFlagTop + Ui.flagGERImg_inactive.height)) {
				return 7;
			}

		} else if(this.controls["currentScene"] == "level" && !this.controls["paused"]) {
			let pauseButtonLeft = this.canvas.width - this.pauseButton.width*2.5;
			let pauseButtonTop = this.pauseButton.height/2;
			if(mouseX > pauseButtonLeft && mouseX < (pauseButtonLeft + this.pauseButton.width*2)
				&& mouseY > this.pauseButton.height/2 && mouseY < this.pauseButton.height*2.5) {
					return 1;
			}
			
			let width = parseInt(this.playButton.alt);
			let playButtonLeft = pauseButtonLeft + (this.pauseButton.width - width)/2;
			let playButtonTop = this.playButton.height*2.7;
			if(mouseX > playButtonLeft && mouseX < (playButtonLeft + width*2)
				&& mouseY > playButtonTop && mouseY < (playButtonTop + this.playButton.height*2)
				&& !(this.controls["placingTower"] || this.controls["upgradingTower"])) {
					return 2;
			}
		} else if(this.controls["currentScene"] == "gameOver" && this.gameOverOpacity >= 1) {
			let menuButtonLeft = this.canvas.width / 2 - (this.mainMenuButton.width / 2) * 4;
			let menuButtonTop = Math.floor(this.canvas.height * 2/3) - (this.mainMenuButton.height/2) * 4;
			if(mouseX > menuButtonLeft && mouseX < menuButtonLeft + this.mainMenuButton.width*4
				&& mouseY > menuButtonTop && mouseY < menuButtonTop + this.mainMenuButton.height*4) {
					return 3;
			}
		}
		return 0;
	}
	
	// Handles the effects of clicked buttons
	clickButton(evt) {
		if(this.controls && (this.controls["currentScene"] == "level" || this.controls["currentScene"] == "gameOver")) {
			switch(this.mouseOverButton) {
				case 1:	// Pause Button was pressed
					this.controls["paused"] = !this.controls["paused"];
					break;
				case 2: // Play Button was pressed
					if(this.level.inWave) { this.controls["speedup"] = this.controls["speedup"]%3+1; }
					else { this.level.startWave(); }
					break;	
				case 3:	// Back to Menu Button was pressed
					this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.controls["currentScene"] = "load";
					this.controls["speedup"] = 1;
					this.gameOverOpacity = -2;
					this.doLoadingScreen("mainMenu");
					break;
				case 6: Languages.language = "English"; break;
				case 7: Languages.language = "German"; break;
				default: break;	// Nothing was clicked
			}
		}
	}
	
	update(duration) {
		let ctx = this.canvas.getContext("2d");
		let hoverButton = this.mouseOverButton;
		if(this.loading) {
			this.animate(duration);
		} else if(this.controls["currentScene"] == "level") {
			// Draw Buttons and check for hover states
			let ctx = this.canvas.getContext("2d");
			let hoverButton = this.mouseOverButton;
			if(this.controls["paused"]) {
				// darken the background when paused
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				ctx.save();
				ctx.fillStyle = "#00000088";
				ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				ctx.restore();
				this.darkened = true;
				// Draw pause menu buttons
				let continueScale = 1;
				if(hoverButton == 1) {
					continueScale = 1.1;
				}
				ctx.drawImage(this.continueButton, this.canvas.width/2 - this.continueButton.width*3*continueScale, Math.floor(this.canvas.height/3) - this.continueButton.height*3*continueScale, this.continueButton.width*6*continueScale, this.continueButton.height*6*continueScale);
				
				let menuScale = 1;
				if(hoverButton == 3) {
					menuScale = 1.1;
				}
				ctx.drawImage(this.mainMenuButton, this.canvas.width/2 - this.mainMenuButton.width*3*menuScale, Math.floor(this.canvas.height*2/3) - this.mainMenuButton.height*3*menuScale, this.mainMenuButton.width*6*menuScale, this.mainMenuButton.height*6*menuScale);

				// draw flags for language control
				let hoveredFlag = null;
				if (this.mouseOverButton == 6 || this.mouseOverButton == 7) {
					hoveredFlag = this.mouseOverButton;
				}
				Ui.drawFlags(ctx, this.canvas, false, hoveredFlag);

			} else {
				if(this.darkened) {  this.darkened = false; }
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				// Center Pause and Play button on the same axis
				let buttonsCenterX = this.canvas.width - this.pauseButton.width*1.5;
				// Draw Pause Button
				let pauseScale = 1;
				if(hoverButton == 1) {
					pauseScale = 1.1;
				}
				ctx.clearRect(buttonsCenterX - this.pauseButton.width*1.1, 0, this.pauseButton.width*2.2, this.pauseButton.height*2.6);
				ctx.drawImage(this.pauseButton ,buttonsCenterX - this.pauseButton.width*pauseScale, this.pauseButton.height*(1.5-pauseScale), this.pauseButton.width*2*pauseScale, this.pauseButton.height*2*pauseScale);
				
				// Draw Play Button or Speedup Button
				let playScale = 1;
				if(hoverButton == 2) {
					playScale = 1.1;
				}
				let width = parseInt(this.playButton.alt);
				ctx.clearRect(buttonsCenterX - width*1.1, this.playButton.height*2.6, width*2.2, this.playButton.height*2.2);
				let currentImage = this.level.inWave?this.controls["speedup"]:0;
				ctx.drawImage(this.playButton, currentImage*width, 0, width, this.playButton.height, buttonsCenterX - width*playScale, this.playButton.height*(3.7-playScale), width*2*playScale, this.playButton.height*2*playScale);
				
				let menuScale = 1;
				if(hoverButton == 3) {
					menuScale = 1.1;
				}
				
				// Draw Health and Wave Counter
				let statCenterX = this.snowImg.width*2;
				
				ctx.drawImage(this.healthImg, statCenterX-this.healthImg.width*1.5, this.healthImg.height/2, this.healthImg.width*3, this.healthImg.height*3);
				ctx.drawImage(this.snowImg, statCenterX - this.snowImg.width*1.5, this.healthImg.height*4, this.snowImg.width*3, this.snowImg.height*3);
				ctx.drawImage(this.waveImg, statCenterX - this.waveImg.width*1.5, this.healthImg.height*4+this.snowImg.height*3.5, this.waveImg.width*3, this.waveImg.height*3);
				
				ctx.clearRect(statCenterX*2-1, 0, statCenterX*4, this.healthImg.height*4+this.snowImg.height*3.5+this.waveImg.height*3);
				ctx.font = this.healthImg.height*3 + 'px Pixel';
				ctx.fillStyle = "#ffffff";
				ctx.textBaseline = "middle";
				ctx.fillText(this.level.health, statCenterX*2, this.healthImg.height*2);
				ctx.strokeText(this.level.health, statCenterX*2, this.healthImg.height*2);
				
				ctx.fillText(this.level.money, statCenterX*2, this.healthImg.height*4+this.snowImg.height*1.5);
				ctx.strokeText(this.level.money, statCenterX*2, this.healthImg.height*4+this.snowImg.height*1.5);
				
				let waveText = this.level.waveCounter+1 + "/" + this.level.waves.length;
				ctx.fillText(waveText, statCenterX*2, this.healthImg.height*4+this.snowImg.height*3.5+this.waveImg.height*1.5);
				ctx.strokeText(waveText, statCenterX*2, this.healthImg.height*4+this.snowImg.height*3.5+this.waveImg.height*1.5)
				
				Ui.drawUpgradePreview(ctx);
			}
		} else if(this.controls["currentScene"] == "gameOver") {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			let img;
			if(this.level.health <= 0) {
				img = this.loseImg;
				var endscreenText;
				if (Languages.language == "German"){
					endscreenText = Ui.LoseGer;
				} else {
					endscreenText = Ui.LoseEng;
				}

			} else if(this.level.waveCounter >= this.level.waves.length) {
				img = this.winImg;
				if (Languages.language == "German"){
					endscreenText = Ui.WinGer;
				} else {
					endscreenText = Ui.WinEng;
				}
			} else { console.log("Game has ended but neither condition for a Game Over is met."); }
			this.gameOverOpacity += duration;
			if(this.gameOverOpacity < 0) { ctx.globalAlpha = 0; }
			else { ctx.globalAlpha = this.gameOverOpacity; }
			ctx.drawImage(img, 0, 0);
			this.endScreenTextDrawer(ctx, endscreenText);
			let menuScale = 1;
			if(hoverButton == 3) {
				menuScale = 1.1;
			}
			ctx.drawImage(this.mainMenuButton, this.canvas.width/2-(this.mainMenuButton.width/2)*4*menuScale, Math.floor(this.canvas.height*2/3)-(this.mainMenuButton.height/2)*4*menuScale, this.mainMenuButton.width*4*menuScale, this.mainMenuButton.height*4*menuScale);
			ctx.globalAlpha = 1;
		}
	}

	static drawFlags(ctx, canvas, isMainMenu, hoveredFlag) {

		ctx.save();
		if (isMainMenu) {ctx.clearRect(canvas.width - 150, 0, 150, 180);}

		ctx.shadowColor = "#4b4242";
		ctx.shadowBlur = 16;
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 3;

		// english flag
		let scaleEN = 1;

		let flagENImg = Ui.flagENImg_inactive;	// standard
		if (Languages.language == "English"){
			flagENImg = Ui.flagENImg_active;
		}

		if (hoveredFlag == 6){
			scaleEN = 1.05
			ctx.drawImage(flagENImg, canvas.width - ((flagENImg.width + Ui.flagOffset) * scaleEN), Ui.flagOffset * scaleEN, flagENImg.width * scaleEN, flagENImg.height * scaleEN);
		} else {
			ctx.drawImage(flagENImg, canvas.width - ((flagENImg.width + Ui.flagOffset) * scaleEN), Ui.flagOffset * scaleEN, flagENImg.width * scaleEN, flagENImg.height * scaleEN);
		}

		// german flag
		let scaleGER = 1;

		let flagGERImg = Ui.flagGERImg_inactive;	// standard
		if (Languages.language == "German"){
			flagGERImg = Ui.flagGERImg_active;
		}
		if (hoveredFlag == 7){
			scaleGER = 1.05;
			ctx.drawImage(flagGERImg, canvas.width - ((flagGERImg.width + Ui.flagOffset) * scaleGER), Ui.flagOffset * 3 * scaleGER, flagGERImg.width * scaleGER, flagGERImg.height * scaleGER);
		} else {
			ctx.drawImage(flagGERImg, canvas.width - ((flagGERImg.width + Ui.flagOffset) * scaleGER), Ui.flagOffset * 3 * scaleGER, flagGERImg.width * scaleGER, flagGERImg.height * scaleGER);
		}

		ctx.restore();
	}

	endScreenTextDrawer(ctx, endscreenText) {
		ctx.save();
		ctx.shadowColor = '#000000';
		ctx.shadowBlur = 30;
		ctx.shadowOffsetX = 8;
		ctx.shadowOffsetY = 8;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.webkitTextFillStyle = '#ffffff';
		ctx.font = '160px Pixel';
		ctx.fillText(endscreenText, this.canvas.width / 2, 150);
		ctx.restore();
	}

// Philipp:	--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw bubble
    static drawBubble(ctx, x, y, width, height) {
        const radius = 12;
        const topY = y - height;

        const pointerWidth = 34;
        const pointerHeight = 24;
        const pointerOffsetX = 28; // pointer offset from left side

        const pointerStartX = x + pointerOffsetX;
        const pointerTipX = pointerStartX + 10;
        const pointerEndX = pointerStartX + pointerWidth;

        ctx.save();
        ctx.beginPath();

        // start top left
        ctx.moveTo(x + radius, topY);

        // upper border
        ctx.lineTo(x + width - radius, topY);
        ctx.arcTo(x + width, topY, x + width, topY + radius, radius);

        // right border
        ctx.lineTo(x + width, y - radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);

        // lower border until pointer
        ctx.lineTo(pointerEndX, y);

        // pointer
        ctx.lineTo(pointerTipX, y + pointerHeight);
        ctx.lineTo(pointerStartX, y);

        // lower border after pointer
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y - radius, radius);

        // left border
        ctx.lineTo(x, topY + radius);
        ctx.arcTo(x, topY, x + radius, topY, radius);

        ctx.closePath();

        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.restore();
    }
	
	// manage linebreak in canvas
	static wrapText(ctx, text, maxWidth) {
		const words = text.split(' ');
		const lines = [];
		let currentLine = words[0] ;
		
		for (let i = 1; i < words.length; i++) {
			const testLine = currentLine + ' ' + words[i];
			const testWidth = ctx.measureText(testLine).width;
			
			if (testWidth <= maxWidth) {
				currentLine = testLine;
			} else {
				lines.push(currentLine);
				currentLine = words[i];
			}
		}
		
		if (currentLine !== '') {
			lines.push(currentLine);
		}
		
		return lines;
	}
	
	// draw text in bubbles
	static drawBubbleText(ctx, text, bubbleX, bubbleY, bubbleWidth, bubbleHeight) {
		const maxTextWidth = bubbleWidth - Ui.padding * 2;
		
		const lines = Ui.wrapText(ctx, text, maxTextWidth);
		
		Ui.drawBubbleLines(ctx, lines, bubbleX, bubbleY, bubbleHeight);
	}
	
	static drawBubbleLines(ctx, lines, bubbleX, bubbleY, bubbleHeight) {
		const topY = bubbleY - bubbleHeight;
		
		const textX = bubbleX + Ui.padding;
		const textY = topY + Ui.padding;
		
		ctx.save();
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#222222';
		ctx.font = Ui.fontSize;
		
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], textX, textY + i * Ui.lineHeight);
		}
		ctx.restore();
	}
	
	static getBubbleHeight (ctx, text, bubbleWidth) {
		const maxTextWidth = bubbleWidth - Ui.padding * 2;
		const lines = Ui.wrapText (ctx, text, maxTextWidth);
		
		return Ui.padding * 2 + lines.length * Ui.lineHeight;
	}
	
	static getBubbleHeightFromLines(lines) {
		return Ui.padding * 2 + lines.length * Ui.lineHeight;
	}
	
	// get tower position for upgrade marker position
	static getTowerAtPosition(x, y) {
		for(let tower of towers){
			if(Util.getDistance([x, y], [tower.posX, tower.posY]) < tower.hitboxRadius) {
				return tower;
			}
		}
		return null;
	}
	
	// draw upgrade marker for placement
	static drawUpgradeArrow(ctx, x, y, width, height, fillColor) {
		const radius = 8;
		const pointerWidth = 18;
		const pointerHeight = 12;
		
		const left = x- width / 2;
		const top = y - height / 2;
		const right = left + width;
		const bottom = top + height;
		
		const pointerLeft = x - pointerWidth / 2;
		const pointerRight = x + pointerWidth / 2;
		const pointerTipY = top - pointerHeight;
		
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, y - 20);       // Spitze
		ctx.lineTo(x + 10, y - 5);
		ctx.lineTo(x + 4, y - 5);
		ctx.lineTo(x + 4, y + 15);
		ctx.lineTo(x - 4, y + 15);
		ctx.lineTo(x - 4, y - 5);
		ctx.lineTo(x - 10, y - 5);
		ctx.closePath();
		
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		ctx.restore();
	}
	
	static drawUpgradePreview(ctx) {
		if(!state['upgradingTower'] || !upgradeCard) return;
		
		let canPos = towerCv.getBoundingClientRect();
		let towerMouseX = (Util.mouseX - canPos.left) / (canPos.width / towerCv.width);
		let towerMouseY = (Util.mouseY - canPos.top) / (canPos.height / towerCv.height);
		
		let hoveredTower = Ui.getTowerAtPosition(towerMouseX, towerMouseY);
		
		let fillColor = '#ff6b6b';
		
		if(hoveredTower && (hoveredTower instanceof upgradeCard.data.towerType)) {
			fillColor = '#6bff6b';
		}
		let uiCanvas = document.getElementById('UI');
		let uiX = towerMouseX * uiCanvas.width / towerCv.width;
		let uiY = towerMouseY * uiCanvas.height / towerCv.height;
		
		Ui.drawUpgradeArrow(ctx, uiX, uiY - 22, 30, 20, fillColor);
	}
	
	static drawUpgradePreview(ctx) {
		if (!state["upgradingTower"] || !upgradeCard) {
			return;
		}
		
		let canPos = towerCv.getBoundingClientRect();
		let towerMouseX = (Util.mouseX - canPos.left) / (canPos.width / towerCv.width);
		let towerMouseY = (Util.mouseY - canPos.top) / (canPos.height / towerCv.height);
		
		let hoveredTower = Ui.getTowerAtPosition(towerMouseX, towerMouseY);
		let isValidTarget = false;
		
		if (hoveredTower && hoveredTower instanceof upgradeCard.data.towerType) {
			isValidTarget = true;
		}
		
		let uiCanvas = document.getElementById("UI");
		let uiX = towerMouseX * uiCanvas.width / towerCv.width;
		let uiY = towerMouseY * uiCanvas.height / towerCv.height;
		
		let sourceX = 0;
		if(isValidTarget) {
			sourceX = 16;
		}
		let mouseDistX = 15;
		let mouseDistY = 12;
		
		ctx.drawImage(Ui.upgradeArrow, sourceX, 0, 16, 16, uiX + mouseDistX, uiY - mouseDistY, 32, 32);
	}	

}