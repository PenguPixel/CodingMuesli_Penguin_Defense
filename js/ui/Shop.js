// Author:	Philipp Locher
//			Reroll by Timo Lauterbach

class Shop {
	static SPACE = 22;
	static CARD_W = 260;
	static CARD_H = 360;
	static VPOS = 10;
	
	cards = [];
	canPos;
	posX;
	posY;
	width;
	height;
	rerollImg;
	canvas;
	pen;
	hoverIndex = -1;			// für hover Effekt
	clickedIndex = -1;			// für klick Handler
	isActive = false;
	rerollCost = 10;
	
	constructor(canvas, controls) {
		this.canvas = canvas;
		this.pen = canvas.getContext("2d");
		this.width = Shop.CARD_W*3 + Shop.SPACE*2;
		this.height = Shop.CARD_H;
		this.canPos = this.canvas.getBoundingClientRect();
		this.posX = Math.floor((this.canvas.width-this.width)/2);
		this.posY = Math.floor(((this.canvas.height - this.height)/2)+Shop.VPOS);
		this.controls = controls;
		Util.mousePos();
		
		// shake-effect - Philipp
		this.shakeIndex = -1;
		this.shakeTime = 0;			// in Frames
		this.shakeDuration = 12;	// in Frames
		this.shakeStrength = 8;
		
//		this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		window.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.setLanguageButtons();
	}
	
	setLanguageButtons() {
		this.rerollImg = document.getElementById(Languages.button("Reroll"));
	}

	// get click event at position nd connect to Index of clicked card
	handleMouseDown(event){
		if(this.isActive && !this.controls["paused"]) {
			let canPos = this.canvas.getBoundingClientRect();
			let scaleX = this.canvas.width / canPos.width;
			let scaleY = this.canvas.height / canPos.height;
			this.mouseX = (event.clientX - canPos.left) * scaleX;
			this.mouseY = (event.clientY - canPos.top) * scaleY;
			
			this.checkHover(this.mouseX, this.mouseY);
			this.clickedIndex = this.hoverIndex;
			if(this.hoverIndex == 3 && level.money >= this.rerollCost) {
				let choice = CardPool.createThreeCardChoice(deck, towers, level.money);
				this.setThreeCards(choice);
				level.money -= this.rerollCost;
				if(this.rerollCost < 90) { this.rerollCost += 10; }
			}
		}
	}
	
	// return clicked card
	getClickedCard() {
		if(this.cards.length !== 3 || this.clickedIndex === -1) return null;
		return this.cards[this.clickedIndex];
	}
	
	// check for card on mouse position and get index of card
	checkHover(mouseX, mouseY){
		
		this.hoverIndex = -1;
		
		for(let i = 0; i < 3; i++){
			let x = this.posX + i * (Shop.CARD_W + Shop.SPACE);
			
			if(mouseX >= x && mouseX <= x + Shop.CARD_W && mouseY >= this.posY && mouseY <= this.posY + Shop.CARD_H) {
				this.hoverIndex = i;
			}
		}
		// reroll by Timo ----------------------------------------------------------------------------------------
		let rerollCenterY = (this.canvas.height/2 + this.cards[0].img.height/2 + Shop.VPOS + 30) + this.rerollImg.height;
		let rerollCenterX = this.canvas.width/2;
		if((mouseX > (rerollCenterX - this.rerollImg.width)) && (mouseX < (rerollCenterX + this.rerollImg.width))
			&& (mouseY > (rerollCenterY - this.rerollImg.height)) && (mouseY < (rerollCenterY + this.rerollImg.height))) {
				this.hoverIndex = 3;
		}
		//	--------------------------------------------------------------------------------------------------------
	}
	
	setThreeCards(cards){
		this.cards = cards;
	}
	
	clear() {
		this.pen.clearRect(0,0,this.canvas.width,this.canvas.height);		// Canvas leeren
	}

	// dim canvas and call drawTreeCards()
	display(){
		if(this.cards.length !==3) return;
		
		let canPos = this.canvas.getBoundingClientRect();
		let scaleX = this.canvas.width / canPos.width;
		let scaleY = this.canvas.height / canPos.height;

		let mouseX = (Util.mouseX - canPos.left) * scaleX;
		let mouseY = (Util.mouseY - canPos.top) * scaleY;
		
		this.checkHover(mouseX, mouseY);
		
		this.clear();
		this.drawThreeCards();
	}
	
	// card-shake effect by Philipp
	triggerCardShake(index) {
		if(index === -1) return;
		this.shakeCardIndex = index;
		this.shakeTime = this.shakeDuration;
	}
	
	drawThreeCards(){
		let shakeOffsetX = 0;
		if(this.shakeTime > 0) {
			let progress = this.shakeDuration - this.shakeTime;
			let fade = this.shakeTime / this.shakeDuration;
			shakeOffsetX = Math.sin(progress * 2) * this.shakeStrength * fade;
			this.shakeTime--;
			
			if(this.shakeTime <= 0){
				this.shakeCardIndex = -1;
			}
		}
		// Timo // Reroll Button ------------------------------------------------------------------------------------------------------------
		this.pen.save();
		this.pen.shadowColor = 'rgba( 0, 0, 0, 0.8)';
		this.pen.shadowBlur = 8;			
		this.pen.shadowOffsetX = 2;
		this.pen.shadowOffsetY = 2;
		this.pen.textAlign = 'center';
		this.pen.textBaseline = 'middle';
		this.pen.fillStyle ='#FF9D00';
		this.pen.font = '30px Pixel';
		let rerollCenterY = (this.canvas.height/2 + this.cards[0].img.height/2 + Shop.VPOS + 30) + this.rerollImg.height;
		let rerollCenterX = this.canvas.width/2;
		let hoverScale = (this.hoverIndex == 3)?1.1:1;
		this.pen.drawImage(this.rerollImg, rerollCenterX - this.rerollImg.width * hoverScale, rerollCenterY - this.rerollImg.height * hoverScale, this.rerollImg.width*2*hoverScale, this.rerollImg.height*2*hoverScale);
		this.pen.fillText(this.rerollCost, rerollCenterX + (this.rerollImg.width - 23)*hoverScale, rerollCenterY+4*hoverScale);
		this.pen.restore();
		// -----------------------------------------------------------------------------------------------------------------------------------
		
		for(let i = 0; i < 3; i++){
			this.pen.save();
			this.pen.textBaseline = 'top';
			this.pen.fillStyle = 'white';
			this.pen.shadowColor = 'rgba( 0, 0, 0, 0.8)';
			this.pen.shadowBlur = 14;
			this.pen.shadowOffsetX = 6;
			this.pen.shadowOffsetY = 6;

			// draw tree cards from setThreeCards array
			let x = this.posX + i * (Shop.CARD_W + Shop.SPACE);
	
			// shake effect by Philipp
			let cardShakeX = 0;
			if(i === this.shakeCardIndex) {
				cardShakeX = shakeOffsetX;
			}
			
			// hover effect by Philipp
			let scale = 1.0;
			if(i === this.hoverIndex){			
				scale = 1.08;
			}
			
			let w = Shop.CARD_W * scale;
			let h = Shop.CARD_H * scale;
			let hT = h + Shop.VPOS + 8;
			
			// store text size
			let textW = 0;
			let textH = 0;
		
			// center cards
			let offsetX = (w - Shop.CARD_W) / 2;		
			let offsetY = (h - Shop.CARD_H) / 2;
			
			let card = this.cards[i];
			if(!card || !card.img) continue;
			this.pen.drawImage(card.img, x - offsetX + cardShakeX, this.posY - offsetY, w, h);
			
			// draw headline on card
		
			// draw stats on card
			if(card.type == 'tower'){ // Tower Karten
				const cardLeft = x - offsetX + cardShakeX;
				const cardTop = this.posY - offsetY;
				const cardBottom = cardTop + h;
				
				// draw cost on card
				this.pen.save();
				this.pen.shadowColor = 'rgba( 0, 0, 0, 1)';
				this.pen.shadowBlur = 2	;			
				this.pen.shadowOffsetX = 0;
				this.pen.shadowOffsetY = 0;
				this.pen.textAlign = 'center';
				this.pen.textBaseline = 'middle';
				this.pen.fillStyle ='#FF9D00';
				this.pen.font = '30px Pixel';
				this.pen.fillText(card.data.cost, cardLeft + w - 22, cardTop +26);
				this.pen.restore();

				let texts = Languages.getCardDescByLanguage(card);
				
				this.pen.font = '18px Pixel';
				this.pen.fillText(texts[0], cardLeft + 15,cardTop + 5);
				this.pen.font = '32px Pixel';
				
				textW = this.pen.measureText(card.name).width;
				this.pen.fillText(card.name, cardLeft +((w - textW)/2), cardTop +36 );
				
				this.pen.font = '24px Pixel';
				textW = this.pen.measureText(texts[1]).width;
				this.pen.fillText(texts[1], cardLeft +((w - textW)/2), cardBottom - 86);
				
				textW = this.pen.measureText(texts[2]).width;
				textH = this.pen.measureText('Lorem ipsum').fontBoundingBoxAscent;
				this.pen.fillText(texts[2], cardLeft +((w - textW)/2), cardBottom -58);
				
			} else {	// upgrade card
				const cardLeft = x - offsetX + cardShakeX;
				const cardTop = this.posY - offsetY;
				const cardBottom = cardTop + h;
				
				let texts = Languages.getCardDescByLanguage(card);
				
				this.pen.font = '18px Pixel';
				this.pen.fillText(texts[0], cardLeft + 15,cardTop + 5);
				
				// draw cost on card
				this.pen.save();
				this.pen.shadowColor = 'rgba( 0, 0, 0, 1)';
				this.pen.shadowBlur = 2;				
				this.pen.shadowOffsetX = 0;
				this.pen.shadowOffsetY = 0;
				this.pen.textAlign = 'center';
				this.pen.textBaseline = 'middle';
				this.pen.fillStyle ='#FF9D00';
				this.pen.font = '30px Pixel';
				this.pen.fillText(card.data.cost, cardLeft + w - 22, cardTop +26);
				this.pen.restore();
				
				this.pen.font = '32px Pixel';
				textW = this.pen.measureText(card.data.towerName).width;
				this.pen.fillText(card.data.towerName, cardLeft +((w - textW)/2), cardTop +30 );
				
				this.pen.font = '24px Pixel';
				textW = this.pen.measureText(card.name).width;
				this.pen.fillText(card.name, cardLeft +((w - textW)/2), cardTop +66 );
				
				this.pen.font = '24px Pixel';
				textW = this.pen.measureText(texts[1]).width;
				this.pen.fillText(texts[1], cardLeft +((w - textW)/2), cardBottom - 88);
				
				textW = this.pen.measureText(texts[2] + ((card.data.mode=="%")?"%":"")).width;
				textH = this.pen.measureText('Lorem ipsum').fontBoundingBoxAscent;
				this.pen.fillText(texts[2] + ((card.data.mode=="%")?"%":""), cardLeft +((w - textW)/2), cardBottom - 56);
			}
			this.pen.restore();

			// draw tooltip bubble while hover
			if(i === this.hoverIndex){
				const bubbleX = x + 128;
				const bubbleY = this.posY - 15;
				const bubbleText = card.data.description;
				const bubbleW = 200;
				this.pen.font = Ui.fontSize;
				const bubbleH = Ui.getBubbleHeight (this.pen, bubbleText, bubbleW);
				
				this.pen.save();
				this.pen.textBaseline = 'top';
				this.pen.shadowColor = 'rgba( 0, 0, 0, 0.8)';
				this.pen.shadowBlur = 14;
				this.pen.shadowOffsetX = 6;
				this.pen.shadowOffsetY = 6;
				Ui.drawBubble (this.pen, bubbleX, bubbleY, bubbleW, bubbleH);
				this.pen.restore();
				Ui.drawBubbleText (this.pen, bubbleText, bubbleX, bubbleY, bubbleW, bubbleH);
			}
			
		}
	}
}