// Author: Philipp Locher
// Additions: Timo Lauterbach (marked)
class Card{
	/*static RANGE_DESC = "Erhöht die Angriffsreichweite";
	static SPEED_DESC = "Erhöht die Angriffsgeschwindigkeit";
	static TROUTERANG_DESC = "Erhöht die Anzahl an Forellerängen für den Turm um 1.";
	static PIERCE_DESC = "Erhöht die Anzahl an Gegnern, die ein Zapfen durchdringen kann.";*/
	static _DESCS = {
		"German":	{
			"RangeDesc":		"Erhöht die Angriffsreichweite",
			"SpeedDesc":		"Erhöht die Angriffsgeschwindigkeit",
			"TrouterangDesc":	"Erhöht die Anzahl an Forellerängen für den Turm um 1.",
			"PierceDesc":		"Erhöht die Anzahl an Gegnern, die ein Zapfen durchdringen kann.",
			"RangeStatName":		"Reichweite",
			"SpeedStatName":		"Geschwindigkeit",
			"TrouterangStatName":	"Forellerang Anzahl",
			"PierceStatName":		"Durchschuss",
			"RangeSmall":		"Geringe Reichweite",
			"RangeEpic":		"Große Reichweite",
			"SpeedSmall":		"Geringe Geschwindigkeit",
			"SpeedEpic":		"Große Geschwindigkeit",
			"Trouterang":		"Forellerang",
			"Pierce":			"Durchschuss"
		},
		"English":	{
			"RangeDesc":		"Increases the range.",
			"SpeedDesc":		"Increases the attack speed.",
			"TrouterangDesc":	"Increases the amount of Trouterangs for this tower by 1.",
			"PierceDesc":		"Increases the amount of pierce for this tower.",
			"RangeStatName":		"Range",
			"SpeedStatName":		"Attack Speed",
			"TrouterangStatName":	"Trouterang Amount",
			"PierceStatName":		"Pierce",
			"RangeSmall":		"Little Range",
			"RangeEpic":		"Big Range",
			"SpeedSmall":		"Little Speedup",
			"SpeedEpic":		"Big Speedup",
			"Trouterang":		"Trouterang",
			"Pierce":			"Pierce"
		}
	}
	static get RANGE_DESC()		{ return Card._DESCS[Languages.language]["RangeDesc"]; }
	static get SPEED_DESC() 	{ return Card._DESCS[Languages.language]["SpeedDesc"]; }
	static get TROUTERANG_DESC(){ return Card._DESCS[Languages.language]["TrouterangDesc"]; }
	static get PIERCE_DESC()	{ return Card._DESCS[Languages.language]["PierceDesc"]; }
	static get DICT() { return Card._DESCS[Languages.language]; }
	
	id;			// unique name
	type;		// tower / upgrade / etc.
	name;		// shown name
	data;		// stats and effects
	img;		// img from html
	rate;
	
	constructor(id, type, name, data, img, rate){
		this.id = id;
		this.type = type;
		this.name = name;
		this.data = data;
		this.img = img;
		this.rate = rate;
	}
}

class CardRegistry {
	static classes = [];
	
	static register(cardClass) {
		CardRegistry.classes.push(cardClass);
	}
}

class CardPool{ 
	static cards = {};
	
	static load() {
		CardPool.cards = [];
		
		for (let CardClass of CardRegistry.classes) {
			CardPool.register(new CardClass());
		}
		
	}
	
	static register(card){
		CardPool.cards[card.id] = card;
	}
	
	static get(id){
		return CardPool.cards[id] || null;
	}
	
	static createDeck(){
		let deck = [];
		
		for (let card of Object.values(CardPool.cards)){
			deck.push(card);
		}
		return deck;
	}
	
	static weightedRandom(list) {			// includes drop rate from card object
		let totalRate = 0;
		
		for (let i = 0; i < list.length; i++){
			totalRate += list[i].rate;
		}
		
		let random =Math.random() * totalRate;
		for (let i = 0; i < list.length; i++){
			random -= list[i].rate;
			
			if (random <= 0) {	return list[i];	}
		}
		return list[list.length -1];
	}
	
	static removeCardOnce(list, card) {		// prevents cards from being drawn multiple times
		for (let i = 0; i < list.length; i++){
			if (list[i] === card) {
				list.splice(i,1);
				return;
			}
		}
	}
	
	static createThreeCardChoice(deck, towers, money){
		let result = [];
		let pool = deck.slice();

		let allTowers = [];
		for (let i = 0; i < pool.length; i++){
			if (pool[i].type === "tower") {
				allTowers.push(pool[i]);
			}
			// Timo: remove unusable cards from pool	------------------------------------------------------------------------------------------------------------
			if(pool[i].type === "upgrade") {
				let towerInGame = false;
				for(let tower of towers) {
					if(tower instanceof pool[i].data.towerType) {
						towerInGame = true;
						break;
					}
				}
				if(!towerInGame) {
					pool.splice(i--, 1);
				}
			}
			//	---------------------------------------------------------------------------------------------------------------------------------------------------
		}
		
		if(pool.length === 0) return result;
		
		// always get one tower
		if (allTowers.length > 0) {
			let towerCard = CardPool.weightedRandom(allTowers);
			result.push(towerCard);
			CardPool.removeCardOnce(pool, towerCard);
		}
	
		// get cheapest remaining card from pool
		let cheapestCost = Infinity;
		for (let card of pool) {
			if (card.data.cost < cheapestCost) {
				cheapestCost = card.data.cost;
			}
		}
	
		// show at least one affordable card as long as player has enough currency for cheapest available card
		if (money >= cheapestCost) {
			let affordableCards = [];
	
			for (let card of pool) {
				if (card.data.cost <= money) {
					affordableCards.push(card);
				}
			}
	
			if (affordableCards.length > 0) {
				let safeAffordable = CardPool.weightedRandom(affordableCards);
				result.push(safeAffordable);
				CardPool.removeCardOnce(pool, safeAffordable);
			}
		}
	
		while (result.length < 3 && pool.length > 0) {
			let picked = CardPool.weightedRandom(pool);
			result.push(picked);
			CardPool.removeCardOnce(pool, picked);
		}
	
		return result;
	}
}