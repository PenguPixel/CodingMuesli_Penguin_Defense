"use strict";
// Authors: Timo Lauterbach (mostly),
//			Philipp Locher (marked)

// Constants and global variables

var towers = [];
var enemies = [];
var projectiles = [];

var shop;		// Philipp new shop UI
var deck;		// Philipp new deck for run
var level;
var path;
var menu;
var ui;
var menuAudio, levelAudio;

var mapCv, towerCv, enemyCv, shopCv, uiCv;	// enemy Canvas gets used to display projectiles as well
const CV_WIDTH = 1280;
const CV_HEIGHT = 704;
const CVUI_WIDTH = 1280;
const CVUI_HEIGHT = 704;

var animationID;
var lastTimestamp = 0;

var state = {
	"inWave": false,
	"inShop": false,
	"placingTower": false,
	"upgradingTower": false,
	"paused": false,
	"speedup": 1,
	"currentScene": "mainMenu",
	"medals": [0, 0, 0]
}
var towerToPlace;
var upgradeCard;
var towerToPlaceBindFunction
var selectedTower;
var purchaseSuccessful = false;		// Philipp

// Gameloop functions

function updateLevel(newTimestamp) {
	if(!state["paused"]) {
		// Calculate duration since last call
		let duration = (newTimestamp - lastTimestamp) / 1000;
		// DEBUG:
		//duration = 0.002;
		// DEBUG END
		duration *= state["speedup"];
		if(state["placingTower"]) {
			towerToPlace.selected = true;
		}
		level.update(duration);
		if(level.levelOver) {
			uiCv.getContext("2d").clearRect(0, 0, uiCv.width, uiCv.height);
			state["speedup"] = 1;
			if(level.health <= 0) { state["currentScene"] = "gameOver"; }
			else if(level.waveCounter <= level.waves.length) {
				if(state["currentScene"] != "gameOver") {
					let medal;
					if(level.health == 100) {
						medal = 3;
					} else if(level.health >= 50) {
						medal = 2;
					} else {
						medal = 1;
					}
					if(medal > state["medals"][level.getLevelId()]) {
						state["medals"][level.getLevelId()] = medal;
						localStorage.setItem("medals", JSON.stringify(state["medals"]));
					}
				}
				state["currentScene"] = "gameOver";
			}
			else { console.log("Level has been flagged as over but neither the health has depleted, nor the last wave ended"); }
		}
		if(level.readyForShop) {
			state["inWave"] = false;
			level.readyForShop = false;
			showShop();
		}
		// Clear enemy and tower canvas before updating everything
		enemyCv.getContext("2d").clearRect(0, 0, enemyCv.width, enemyCv.height);
		for(let i = enemies.length-1; i >= 0; i--) {	// update from the back to the front so enemies at the front get drawn over those behind them
			enemies[i].update(duration);
			if((i < enemies.length-1) && (enemies[i].progress < enemies[i+1].progress)) {	// swap enemies if they overtake another
				let tmp = enemies[i];
				enemies[i] = enemies[i+1];
				enemies[i+1] = tmp;
			}
		}
		towerCv.getContext("2d").clearRect(0, 0, towerCv.width, towerCv.height);
		for(let tower of towers) {
			tower.update(duration);
		}
		for(let projectile of projectiles) {
			projectile.update(duration);
		}
		
		// Von Philipp und Timo	--------------------------------------------------------------------------------------------------------------------------
		
		if(shop && state["inShop"] && shop.isActive){ 
			shop.display();
			if(shop.clickedIndex !== -1){	
				let clickedCard = shop.getClickedCard();
				if(clickedCard && clickedCard.type == "tower") {
					if(level.money >= clickedCard.data.cost) {
						state["placingTower"] = true;
						let x = shop.mouseX * towerCv.width/shopCv.width;
						let y = shop.mouseY * towerCv.height/shopCv.height;
						towerToPlace = new clickedCard.data.towerType(x, y);
						if(selectedTower) { selectedTower.selected = false; }
						selectedTower = towerToPlace;
						selectedTower.selected = true;
						towers.push(towerToPlace);
						level.addMoney(-clickedCard.data.cost);
						window.addEventListener("mousedown", placeTower);
						
						purchaseSuccessful = true;
					} else {
						// Not enough money, maybe show message
						//	console.log('Not enough money');
			// DEBUG	console.log('Cklicked Index '+ shop.cklickedIndex); DEBUG END
						shop.triggerCardShake(shop.clickedIndex);
					}
				} else if(clickedCard && clickedCard.type == "upgrade") {
					if(level.money >= clickedCard.data.cost) {					// Philipp Money for Upgrades
						state["upgradingTower"] = true;
						upgradeCard = clickedCard;
						level.addMoney(-clickedCard.data.cost);
						window.addEventListener("mousedown", upgradeTower);
						
						purchaseSuccessful = true;
					} else {
						console.log('Not enough money for Upgrade');
			// DEBUG	console.log('Cklicked Index '+ shop.cklickedIndex); DEBUG END
						shop.triggerCardShake(shop.clickedIndex);
					}		
				}
				
				// Philipp - Shop nur schließen wenn Kauf erfolgreich
				if(purchaseSuccessful) {
					clickedCard.data.cost = Math.round(clickedCard.data.cost * 1.4);
					if(clickedCard.data.cost > 999) { clickedCard.data.cost = 999; }
					closeShop();
				}
				
				//	----------------------------------------------------------------------------------------------------------------------------------------
				
				shop.clickedIndex = -1;
				purchaseSuccessful = false;
			}
		}
	}
}

function updateMainMenu() {
	if(menu.active) {
		menu.update();
	} else {
		state["currentScene"] = "load";
		ui.doLoadingScreen("level");
	}
}

function updateUi(newTimestamp) {
	let duration = (newTimestamp - lastTimestamp) / 1000;
	ui.update(duration);
}

function updateLoad(newTimestamp) {
	if(!ui.loading) {
		let duration = (newTimestamp - lastTimestamp) / 1000;
		ui.loadTimer += duration;
		if(ui.loadTimer > Ui.LOAD_DELAY) {
			if(ui.nextScene == "level") {
				loadLevel(menu.selectedLevel);
				state["currentScene"] = "level";
			} else if(ui.nextScene == "mainMenu") {
				loadMainMenu();
				shop.isActive = false;
				state["paused"] = false;
				state["currentScene"] = "mainMenu";
			}
			ui.fadeOutLoad();
		}
	}
}

function update(newTimestamp) {
	// Only set the last timestamp on first call to prevent unintended behaviour
	if(!lastTimestamp) {
		lastTimestamp = newTimestamp;
		animationID = requestAnimationFrame(update);
		return;
	}
	if(state["currentScene"] == "level") {
		updateLevel(newTimestamp);
	} else if(state["currentScene"] == "mainMenu") {
		updateMainMenu();
	} else if(state["currentScene"] == "load") {
		updateLoad(newTimestamp);
	} else if(state["currentScene"] == "gameOver") {
		updateLevel(newTimestamp);
	}
	updateUi(newTimestamp);
	Audiohandler.update();
	// finish up function call and request next frame
	lastTimestamp = newTimestamp;
	animationID = requestAnimationFrame(update);
}

function placeTower(evt) {
	if(towerToPlace.validPlacement) {
		window.removeEventListener("mousedown", placeTower);
		// Sound abspielen für Turmplatzierung
		Tower.choosePlacementSound(towerToPlace);
		towerToPlace.isPlaced = true;
		state["placingTower"] = false;
		towerToPlace = null;
		towerToPlaceBindFunction = null;
	}
}

function getClickedTower(evt) {
	let canPos = towerCv.getBoundingClientRect();
	let x = (evt.clientX - canPos.left) / (canPos.width / towerCv.width);
	let y = (evt.clientY - canPos.top) / (canPos.height / towerCv.height);
	for(let tower of towers) {
		if(Util.getDistance([x, y], [tower.posX, tower.posY]) < tower.hitboxRadius) {
			return tower;
		}
	}
	return null;
}

function upgradeTower(evt) {
	let tower = getClickedTower(evt);
	if(tower && tower instanceof upgradeCard.data.towerType) {
		let func = upgradeCard.data.function;
		func(tower, upgradeCard.data.amount, upgradeCard.data.mode);
		// Sound für Upgrade Positionieren
		Audiohandler.requestAudio(Ui.upgradeAudio);
		window.removeEventListener("mousedown", upgradeTower);
		state["upgradingTower"] = false;
		upgradeCard = null;
	}
}

function checkClickedTower(evt) {
	if(selectedTower) { selectedTower.selected = false; }
	let tower = getClickedTower(evt);
	if(tower) {
		tower.selected = true;
		selectedTower = tower;
	}
}

function showShop() {	
	shop.isActive = true; 
	state["inShop"] = true; 
	let choice = CardPool.createThreeCardChoice(deck, towers, level.money);
	shop.setThreeCards(choice);
}

function closeShop() {
	shop.clear();
	shop.isActive = false;
	state["inShop"] = false;
	shop.rerollCost = 10;
}

function switchLanguage() {
	Languages.language = Languages.language == "German" ? "English" : "German";
	menu.setLanguageButtons();
	ui.setLanguageButtons();
	shop.setLanguageButtons();
}

function control(evt) {
	switch(evt.keyCode) {
		//case 171: level.waveCounter++; level.money+=50; break;	// +	DEBUG: skip wave
		//case 76: level.health = 0; break;	// L DEBUG for losescreen
		case 27: state["paused"] = !state["paused"]; break;	// Esc
		/*case 32: state["inShop"] = true;
				 shop.isActive = true;
				 break;	// Space DEBUG for winscreen*/
		case 83:	// S
			if(state["inShop"]) { level.startWave(); }
			else { state["speedup"] = state["speedup"]%3 + 1; break; }
		case 88:	// X
			if(state["inShop"] && shop.isActive) {
				shop.clear();
				shop.isActive = false;
			} else if(state["inShop"] && !shop.isActive) {
				shop.display();
				shop.isActive = true;
			}
			break;
		default: console.log("Key " + evt.keyCode + " is not mapped to any action.");
	}
}

function loopLevelAudio(evt) {
	if(evt.target.currentTime > 193) { evt.target.currentTime = 0.4; }
}

// Creation of level

function setupCanvas() {
	mapCv = document.getElementById("MAP");
	towerCv = document.getElementById("TOWERS");
	enemyCv = document.getElementById("ENEMIES");
	shopCv = document.getElementById("SHOP");		//Philipp - integrate new shop UI canvas including cards
	uiCv = document.getElementById("UI");
	mapCv.width = CV_WIDTH;
	mapCv.height = CV_HEIGHT;
	towerCv.width = CV_WIDTH;
	towerCv.height = CV_HEIGHT;
	enemyCv.width = CV_WIDTH;
	enemyCv.height = CV_HEIGHT;
	shopCv.width = CVUI_WIDTH;					//Philipp - full scale UI canbas
	shopCv.height = CVUI_HEIGHT;
	uiCv.width = CVUI_WIDTH;
	uiCv.height = CVUI_HEIGHT;
	mapCv.getContext("2d").imageSmoothingEnabled = false;
	towerCv.getContext("2d").imageSmoothingEnabled = false;
	enemyCv.getContext("2d").imageSmoothingEnabled = false;
	shopCv.getContext("2d").imageSmoothingEnabled = false;
	uiCv.getContext("2d").imageSmoothingEnabled = false;
}

function setupLevel(id = 0) {
	Tile.TILESET = document.getElementById("TILESET");
}

function setupTowers() {
	Tower.enemies = enemies;
	Tower.towers = towers;
	Tower.cv = towerCv;
	Tower.level = level;
	window.addEventListener("click", checkClickedTower);
}

function setupEnemies() {
	Enemy.enemies = enemies;
	Enemy.cv = enemyCv;
}

function setupProjectiles() {
	Projectile.projectiles = projectiles;
	Projectile.enemies = enemies;
	Projectile.cv = enemyCv;	// Could use seperate canvas, but not required as of now
}

// Philipp
function setupShop(){
	shop = new Shop(shopCv, state);
}

function setupFlags(){
	Ui.flagENImg_inactive = document.getElementById("FLAG_EN");
	Ui.flagENImg_active = document.getElementById("FLAG_EN_ACTIVE");
	Ui.flagGERImg_inactive = document.getElementById("FLAG_GER");
	Ui.flagGERImg_active = document.getElementById("FLAG_GER_ACTIVE");
}

function setupAudio() {
	menuAudio = document.getElementById("MENU_TRACK");
	levelAudio = document.getElementById("LEVEL_TRACK");
	levelAudio.addEventListener("timeupdate", loopLevelAudio);
	menuAudio.volume = 0.25;
	levelAudio.volume = 0.15;
	Tower.throwAudio1 = document.getElementById("THROW_1");
	Tower.throwAudio1.volume = 1;
	Tower.throwAudio2 = document.getElementById("THROW_2");
	Tower.throwAudio2.volume = 0.08;
	Projectile.hitAudio1 = document.getElementById("HIT1");
	Projectile.hitAudio1.volume = 0.1;
	Projectile.hitAudio2 = document.getElementById("HIT2");
	Projectile.hitAudio2.volume = 0.1;
	Ui.buyAudio = document.getElementById('BUY');
	Ui.buyAudio.volume = 1;
	Ui.upgradeAudio = document.getElementById("UPGRADE_AUDIO");
	Ui.upgradeAudio.volume = 1;
	Ui.placementAudioSnow = document.getElementById("PLACEMENT_AUDIO_SNOW");
	Ui.placementAudioSnow.volume = 1;
	Ui.placementAudioWater = document.getElementById("PLACEMENET_AUDIO_WATER");
	Ui.placementAudioWater.volume = 0.3;
}

// Wait and start the game

window.addEventListener("DOMContentLoaded", start);

function loadLevel(id = 0) {
	shopCv.getContext("2d").clearRect(0, 0, shopCv.width, shopCv.height);
	state["currentScene"] = "level";
	enemies = [];
	towers = [];
	projectiles = [];
	path = new Path(Path.PATHS[id]);
	level = new Level(Level.MAPS[id], path, mapCv, enemies);
	level.display();
	setupTowers();
	setupEnemies();
	setupProjectiles();
	Wave.level = level;
	ui.level = level;
	CardPool.load();
	deck = CardPool.createDeck();
	window.addEventListener("keydown", control);
	menuAudio.pause();
	levelAudio.currentTime = 0;
	levelAudio.play();
	// DEBUG
	/*path.display(mapCv);
	let tmp = new Superpenguin(200, 200);
	tmp.isPlaced = true;
	towers.push(tmp);*/
	//
}

function loadMainMenu() {
	state["currentScene"] = "mainMenu";
	menu.inLevelSelect = false;
	ui.level = null;
	towerCv.getContext("2d").clearRect(0, 0, towerCv.width, towerCv.height);
	enemyCv.getContext("2d").clearRect(0, 0, enemyCv.width, enemyCv.height);
	mapCv.getContext("2d").clearRect(0, 0, mapCv.width, mapCv.height);
	setupFlags();
	menu.load();
	levelAudio.pause();
	menuAudio.currentTime = 0;
	menuAudio.play();
}

function startGame() {
	setupLevel();
	setupTowers();
	setupEnemies();
	setupProjectiles();
	CardPool.load();		//Philipp
	setupShop();			//Philipp
	setupAudio();
	deck = CardPool.createDeck();
	let medals = localStorage.getItem("medals");
	if(medals) {
		state["medals"] = JSON.parse(medals);
	} else {
		localStorage.setItem("medals", JSON.stringify(state["medals"]));
	}
	menu = new Menu(state["medals"]);
	ui = new Ui(state);
	Ui.upgradeArrow = document.getElementById('ARROW');
	loadMainMenu();
	animationID = requestAnimationFrame(update);
}

function waitForClick(evt) {
	window.removeEventListener("click", waitForClick);
	uiCv.getContext("2d").clearRect(0, 0, uiCv.width, uiCv.height);
	uiCv.style.backgroundColor = "#00000000";
	startGame();
}

function start() {
	setupCanvas();
	Util.mousePos();
	let ctx = uiCv.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.font = 42+"px Pixel";
	ctx.textBaseline = "center";
	let msg = Languages.START_MESSAGE;
	ctx.fillText(msg, (uiCv.width-ctx.measureText(msg).width)/2, uiCv.height/2);
	window.addEventListener("click", waitForClick);
}