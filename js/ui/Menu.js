// Author: Timo Lauterbach
class Menu {
	inLevelSelect = false;
	selectedLevel = 0;
	levelDrawn = false;
	active = true;
	backgroundImg;
	levelsButton;
	playButton;
	scrollRightButton; scrollLeftButton;
	selectBorder;
	backgroundCv; buttonsCv;
	medalsImg;
	medalsData;
	
	clickButtonFunction;
	
	constructor(medalsData) {
		this.backgroundImg = document.getElementById("MENU_BACKGROUND");
		this.setLanguageButtons();
		this.scrollRightButton = document.getElementById("SCROLL_RIGHT_BUTTON");
		this.scrollLeftButton = document.getElementById("SCROLL_LEFT_BUTTON");
		this.selectBorder = document.getElementById("SELECT_BORDER");
		this.menuButton = document.getElementById("MENU_BUTTON");
		this.backgroundCv = document.getElementById("SHOP");
		this.buttonsCv = document.getElementById("UI");
		this.clickButtonFunction = this.clickButton.bind(this);
		this.medalsImg = document.getElementById("MEDALS");
		this.medalsData = medalsData;
	}
	
	setLanguageButtons() {
		this.levelsButton = document.getElementById(Languages.button("Levels"));
		this.playButton = document.getElementById(Languages.button("Play"));
	}
	
	// loads the main menu to be displayed and interacted with
	load() {
		this.active = true;
		let ctx = this.backgroundCv.getContext("2d");
		ctx.drawImage(this.backgroundImg, 0, 0);
		window.addEventListener("click", this.clickButtonFunction);
	}
	
	// Returns an id of which button is being hovered over. Returns 0 if none
	get mouseOverButton() {
		let canPos = this.buttonsCv.getBoundingClientRect();
		let scaleX = this.buttonsCv.width / canPos.width;
		let scaleY = this.buttonsCv.height / canPos.height;
		let mouseX = (Util.mouseX - canPos.left) * scaleX;
		let mouseY = (Util.mouseY - canPos.top) * scaleY;
		if(!this.inLevelSelect) {
			let levelsButtonLeft = this.buttonsCv.width/2 - this.levelsButton.width*2;
			let levelsButtonTop = this.buttonsCv.height/2;
			if(mouseX > levelsButtonLeft && mouseX < (levelsButtonLeft + this.levelsButton.width*4)
				&& mouseY > levelsButtonTop && mouseY < (levelsButtonTop + this.levelsButton.height*4)) {
					return 1;
			}

			// add klick behaviour to flags
			let FlagLeft = this.buttonsCv.width - Ui.flagOffset - Ui.flagENImg_inactive.width;
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

		} else {
			let playButtonLeft = this.buttonsCv.width/2 - this.playButton.width*2;
			let playButtonTop = this.buttonsCv.height*2/3;
			if(mouseX > playButtonLeft && mouseX < (playButtonLeft + this.playButton.width*4)
				&& mouseY > playButtonTop && mouseY < (playButtonTop + this.playButton.height*4)) {
					return 5;
			}

			let scrollRightButtonLeft = this.buttonsCv.width/2 + Level.MAPS[this.selectedLevel][0].length*Level.TILE_SIZE/2 + this.scrollRightButton.width;
			let scrollRightButtonTop = Math.floor(this.buttonsCv.height/3) - (this.scrollRightButton.height/2)*4;
			if(mouseX > scrollRightButtonLeft && mouseX < (scrollRightButtonLeft + this.scrollRightButton.width*4)
				&& mouseY > scrollRightButtonTop && mouseY < (scrollRightButtonTop + this.scrollRightButton.height*4)
				&& this.selectedLevel < (Level.MAPS.length-1)) {
					return 3;
			}
			let scrollLeftButtonLeft = this.buttonsCv.width/2 - Level.MAPS[this.selectedLevel][0].length*Level.TILE_SIZE/2 - this.scrollLeftButton.width*5;
			let scrollLeftButtonTop = Math.floor(this.buttonsCv.height/3) - (this.scrollLeftButton.height/2)*4;
			if(mouseX > scrollLeftButtonLeft && mouseX < (scrollLeftButtonLeft + this.scrollLeftButton.width*4)
				&& mouseY > scrollLeftButtonTop && mouseY < (scrollLeftButtonTop + this.scrollLeftButton.height*4)
				&& this.selectedLevel > 0) {
					return 4;
			}
			if(mouseX > this.menuButton.width/2 && mouseX < this.menuButton.width*4.5
				&& mouseY > this.menuButton.height/2 && mouseY < this.menuButton.height*4.5) {
					return 2;
			}
		}
		return 0;
	}
	
	// checks if a button is being hovered over using mouseOverButton and executes the respective function
	clickButton(evt) {
		switch(this.mouseOverButton) {
			case 1: this.inLevelSelect = true; break;	// Levels Button was clicked
			case 2:	// Back to Menu button was clicked
				this.inLevelSelect = false;
				this.levelDrawn = false;
				this.buttonsCv.getContext("2d").clearRect(0, 0, this.buttonsCv.width, this.buttonsCv.height);
				break;
			case 3: this.selectedLevel++; this.levelDrawn = false; break; // Scroll Right button was clicked
			case 4: this.selectedLevel--; this.levelDrawn = false; break; // Scroll Left button was clicked
			case 6: Languages.language = "English"; break;
			case 7: Languages.language = "German"; break;
			case 5:	// Play Level Button was clicked. TODO: Loading Screen?
				this.active = false;
				this.inLevelSelect = false;
				this.levelDrawn = false;
				window.removeEventListener("click", this.clickButtonFunction);
				//this.backgroundCv.getContext("2d").clearRect(0, 0, this.backgroundCv.width, this.backgroundCv.height);
				//this.buttonsCv.getContext("2d").clearRect(0, 0, this.buttonsCv.width, this.buttonsCv.height);
				break;
			default: break;	// No button was clicked
		}
	}
	
	update() {
		if(!this.active) return;
		let ctx = this.buttonsCv.getContext("2d");
		if(this.inLevelSelect) {
			let map = Level.MAPS[this.selectedLevel];
			
			// Draw level preview as select screen. Only draw once for performance reasons
			if(!this.levelDrawn) {
				ctx.clearRect(0, 0, this.buttonsCv.width, this.buttonsCv.height);
				let x = this.buttonsCv.width/2 - map[0].length*Level.TILE_SIZE/2;
				let y = Math.floor(this.buttonsCv.height/3) - map.length*Level.TILE_SIZE/2;
				Level.displayGeneric(this.buttonsCv, map, x, y, 1);
				this.levelDrawn = true;
				let diff = this.selectBorder.height*2 - map.length*Level.TILE_SIZE;
				ctx.drawImage(this.selectBorder, x-diff/2, y-diff/2, this.selectBorder.width*2, this.selectBorder.height*2);
				let medalWidth = parseInt(this.medalsImg.alt);
				let medalLeft = (this.medalsData[this.selectedLevel]) * medalWidth;
				ctx.drawImage(this.medalsImg, medalLeft, 0, medalWidth, this.medalsImg.height,
							x + Level.TILE_SIZE * (map[0].length - 1.25), y-diff, medalWidth*3, this.medalsImg.height*3);
				//ctx.drawImage(this.medalsImg, 100, 100);
			}
			
			// Draw Play button to load the selected level
			let playScale = 1;
			if(this.mouseOverButton == 5) {
				playScale = 1.1;
			}
			ctx.clearRect(this.buttonsCv.width/2 - this.playButton.width*2*1.1, this.buttonsCv.height*2/3-(this.playButton.height*0.05), this.playButton.width*4.4, this.playButton.height*4.4);
			ctx.drawImage(this.playButton, this.buttonsCv.width/2 - this.playButton.width*2*playScale, this.buttonsCv.height*2/3-(this.playButton.height*(playScale-1)/2), this.playButton.width*4*playScale, this.playButton.height*4*playScale);
			
			// Draw Right Scroll Button
			let scrollRightCenterX = this.buttonsCv.width/2 + map[0].length*Level.TILE_SIZE/2 + this.scrollRightButton.width*3;
			let scrollRightCenterY = Math.floor(this.buttonsCv.height/3);
			ctx.clearRect(scrollRightCenterX - (this.scrollRightButton.width/2)*4.4, scrollRightCenterY - (this.scrollRightButton.height/2)*4.4, this.scrollRightButton.width*4.4, this.scrollRightButton.height*4.4);
			// Only show the right arrow if there is actually a further level
			if(this.selectedLevel < Level.MAPS.length-1) {
				let rightScale = 1;
				if(this.mouseOverButton == 3) {
					rightScale = 1.1;
				}
				ctx.drawImage(this.scrollRightButton, scrollRightCenterX - (this.scrollRightButton.width/2)*4*rightScale, scrollRightCenterY - (this.scrollRightButton.height/2)*4*rightScale, this.scrollRightButton.width*4*rightScale, this.scrollRightButton.height*4*rightScale);
			}
			
			// Draw Left Scroll button
			let scrollLeftCenterX = this.buttonsCv.width/2 - map[0].length*Level.TILE_SIZE/2 - this.scrollLeftButton.width*3;
			let scrollLeftCenterY = Math.floor(this.buttonsCv.height/3);
			ctx.clearRect(scrollLeftCenterX - (this.scrollLeftButton.width/2)*4.4, scrollLeftCenterY - (this.scrollLeftButton.height/2)*4.4, this.scrollLeftButton.width*4.4, this.scrollLeftButton.height*4.4);
			// Only show the left arrow if there is actually a previous level
			if(this.selectedLevel > 0) {
				let leftScale = 1;
				if(this.mouseOverButton == 4) {
					leftScale = 1.1;
				}
				ctx.drawImage(this.scrollLeftButton, scrollLeftCenterX - (this.scrollLeftButton.width/2)*4*leftScale, scrollLeftCenterY - (this.scrollLeftButton.height/2)*4*leftScale, this.scrollLeftButton.width*4*leftScale, this.scrollLeftButton.height*4*leftScale);
			}
			
			// Draw Home Menu button
			let homeScale = 1;
			if(this.mouseOverButton == 2) {
				homeScale = 1.1;
			}
			ctx.clearRect(0, 0, this.menuButton.width*4.7, this.menuButton.height*4.7);
			ctx.drawImage(this.menuButton, this.menuButton.width*2.5 - (this.menuButton.width)*2*homeScale, this.menuButton.height*2.5 - (this.menuButton.height)*2*homeScale, this.menuButton.width*4*homeScale, this.menuButton.height*4*homeScale);
			
		} else {
			// Draw Level select button
			let scale = 1;
			if(this.mouseOverButton == 1) {
				scale = 1.1;
			}
			ctx.clearRect(this.buttonsCv.width/2 - this.levelsButton.width*2*1.1, this.buttonsCv.height/2-(this.levelsButton.height*0.05), this.levelsButton.width*4.4, this.levelsButton.height*4.4);
			ctx.drawImage(this.levelsButton, this.buttonsCv.width/2 - this.levelsButton.width*2*scale, this.buttonsCv.height/2-(this.levelsButton.height*(scale-1)/2), this.levelsButton.width*4*scale, this.levelsButton.height*4*scale);

			// draw flags for language controller
			let hoveredFlag = null;
			if (this.mouseOverButton == 6 || this.mouseOverButton == 7) {
				hoveredFlag = this.mouseOverButton;
			}
			Ui.drawFlags(ctx, this.buttonsCv, true, hoveredFlag);
		}
	}
}