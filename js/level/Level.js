// Author: 	Timo Lauterbach
//			Volodymyr Velychko - Money
class Level {
	static START_MONEY = 175;				// :from Vova
	static TILE_SIZE = 32;	// pixel size of single tile
	static TILESET;			// Png of tileset
	// Map 0 & 1 by Jeremias Möller, Decoration by Timo Lauterbach -------------------------------------------------------------------------------------------------------
	static MAP0 =
		[//	1	2	3	4	5	6	7	8	9	0	1	2	3	4	5	6	7	8	9	0
		[	2,	2,	2,	10,	3,	2,	2,	2,	2,	4,	5,	5,	5,	6,	17,	22,	18,	2,	2,  2	],	// 01
		[	2,	2,	2,	10,	3,	new Tile(2,[30]),new Tile(2,[28]),new Tile(2,[29]),new Tile(2,[32]),	10,	0,	12,	1,	3,	14,	9,	26,	18,	2,  2	],	// 02
		[	2,	2,	2,	10,	3,	2,	2,	2,	2,	10,	3,	2,	new Tile(10, [34]),	3,	14,	9,	9,	21,	2,  2	],	// 03
		[	5,	5,	5,	8,	7,	5,	5,	5,	5,	8,	7,	5,	8,	new Tile(3, [34]),	14,	9,	9,	21,	2,  2	],	// 04
		[	12,	12,	12,	1,	0,	12,	12,	12,	12,	1,	0,	12,	12,	13,	14,	9,	9,	21,	new Tile(2,[30]),  2	],	// 05
		[	2,	2,	2,	10,	3,	2,	2,	2,	2,	10,	3,	2,	2,	2,	24,	20,	19,	25,	new Tile(2,[33]),new Tile(2,[30])	],	// 06
		[	new Tile(4,[30]),new Tile(5,[34]),	5,	8,	7,	5,	5,	5,	5,	8,	7,	5,	5,	6,	2,	14,	26,	18,	2,  2	],	// 07
		[	10,	0,	12,	1,	0,	12,	12,	12,	12,	1,	0,	12,	1,	3,	17,	27,	9,	21,	2,  2	],	// 08
		[	10,	3,	new Tile(2, [34]),	10,	3,	2,	2,	2,	2,	10,	3,	2,	10,	3,	14,	9,	9,	21,	2,  2	],	// 09
		[	10,	7,	5,	8,	3,	2,	2,	2,	2,	10,	7,	5,	8,	3,	14,	9,	9,	21,	new Tile(2,[31]),  2	],	// 10
		[	11,	12,	12,	12,	13,	2,	2,	new Tile(2, [37]),	new Tile(2, [39]),	11,	12,	12,	12,	13,	24,	23,	23,	25,	2,  2	],	// 11
	]; //	1									10										20
	static MAP1 =
		[//	1	2	3	4	5	6	7	8	9	0	1	2	3	4	5	6	7	8	9	0
		[	2,	2,  10,	3,	2,	2,	2,	2,	2,	2,	2,	17,	16,	16,	16,	16,	18,	2,	2,  2	],	// 01
		[	new Tile(2, [31]),	new Tile(2, [37]),	10,	3,	2,	4,	5,	5,	6,	2,	new Tile(2, [29]),	new Tile(14, [32]),	9,	9,	9,	9,	21,	2,	2,  2	],	// 02
		[	new Tile(2, [38, 41]),	2,	10,	3,	4,	8,	0,	1,	7,	6,	2,	24,	15,	15,	15,	15,	25,	2,	2,  2	],	// 03
		[	2,	2,	10,	7,	8,	0,	13,	11,	1,	7,	5,	5,	5,	5,	5,	5,	5,	5,	6,  2	],	// 04
		[	2,	2,	11,	12,	12,	13,	2,	2,	11,	12,	12,	12,	12,	12,	12,	12,	12,	1,	3,  2	],	// 05
		[	2,	2,	2,	new Tile(2, [30]),	2,	2,	2,	new Tile(2, [30, 37]),	2,	2,	2,	2,	2,	2,	2,	2,	2,	10,	3,  2	],	// 06
		[	2,	4,	5,	5,	5,	5,	5,	5,	5,	5,	5,	6,	2,	2,	4,	5,	5,	8,	3,  2	],	// 07
		[	2,	10,	0,	12,	12,	12,	12,	12,	12,	12,	1,	7,	6,	new Tile(4, [34]),	8,	0,	12,	12,	13, 2	],	// 08
		[	2,	10,	3,	17,	16,	16,	16,	16,	16,	18,	11,	1,	7,	8,	0,	13,	2,	2,	2,  2	],	// 09
		[	2,	10,	3,	14,	9,	9,	9,	9,	9,	21,	2,	11,	12,	12,	13,	2,	2,	2,	new Tile(2, [41]),  2	],	// 10
		[	2,	10,	3,	24,	15,	15,	15,	15,	15,	25,	2,	2,	2,	2,	2,	2,	2,	new Tile(2, [41]),	new Tile(2, [34]),  2	],	// 11
	];	//	1									10										20
	static MAP2 =
		[//	1	2	3	4	5	6	7	8	9	0	1	2	3	4	5	6	7	8	9	0
		[	5,	5,	5,	5,	5,	6,	2,	new Tile(2,[40]),	new Tile(2,[41]),new Tile(2,[40]),new Tile(2,[37,41]),	2,	2,	2,	2,	2,	2,	2,	2,	2	],	// 01
		[	12,	12,	12,	12,	1,	3,	2,	2,	new Tile(2,[34]),new Tile(2,[38,41]),new Tile(2,[40]),	new Tile(2,[34,39,40]),	2,	2,	17,	22,	22,	18,	2,	2	],	// 02
		[	2,	2,	2,	2,	10,	3,	2,	2,	2,	2,	2,	2,	2,	2,	14,	9,	9,	26,	18,	2	],	// 03
		[	2,	2,	2,	2,	10,	3,	2,	4,	5,	5,	5,	5,	5,	6,	14,	9,	9,	9,	21,	2	],	// 04
		[	2,	2,	2,	2,	10,	7,	5,	8,	0,	12,	12,	12,	1,	3,	14,	9,	9,	9,	21,	2	],	// 05
		[	2,	2,	2,	2,	11,	12,	12,	12,	13,	2,	new Tile(2,[41]),	2,	10,	3,	14,	9,	9,	19,	new Tile(25,[41]),	2	],	// 06
		[	2,	2,	2,	2,	2,	2,	2,	2,	2,	new Tile(2,[32]),	2,	2,	10,	3,	14,	19,	15,	25,	2,	2	],	// 07
		[	2,	new Tile(2,[32]),	4,	5,	5,	5,	5,	5,	5,	5,	5,	5,	8,	3,	24,	25,	2,	new Tile(2,[32]),new Tile(2,[29]),new Tile(2,[28])	],	// 08
		[	2,	new Tile(2,[33]),	10,	0,	12,	12,	12,	12,	12,	12,	12,	12,	12,	13,	2,	2,	2,	2,	2,	2	],	// 09
		[	2,	2,	10,	3,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	new Tile(2,[35]),new Tile(2,[28, 34, 38, 36]),	new Tile(2, [29])	],	// 10
		[	2,	2,	10,	3,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2	]	// 11
	];	//	1									10										20
	//	------------------------------------------------------------------------------------------------------------------------------------------------------------------
	static MAPS = [Level.MAP0, Level.MAP1, Level.MAP2];
	
	map;
	path;
	canvas;
	enemies;
	shop;
	// Volodymyr:
	money = Level.START_MONEY;
	incomeRate = 0; // optional passive income per second
	// :Volodymyr
	waves = [
		new Wave([// Class, amount, interval, start
				[Snowman, 6, 2, 0]
				]),
		new Wave([//2
				[Snowman, 9, 1.8, 0]
				]),
		new Wave([//3
				[Snowman, 12, 1.7, 0]
				]),
		new Wave([//4
				[Snowman, 16, 1.5, 0],
				[Yeti, 2, 3.5, 13]
				]),
		new Wave([//5
				[Snowman, 40, 1.2, 0]
				]),
		new Wave([//6
				[Snowman, 14, 1.2, 0],
				[Yeti, 4, 3.5, 10],
				[Snowman, 9, 1, 17]
				]),
		new Wave([//7
				[Snowman, 18, 1, 0],
				[Yeti, 9, 3, 5]
				]),
		new Wave([//8
				[Yeti, 17, 3, 0]
				]),
		new Wave([//9
				[Snowman, 40, 1, 0],
				[Yeti, 12, 3, 0]
				]),
		new Wave([//10
				[Snowman, 100, 0.5, 0],
				[SnowAngel, 6, 2.2, 50]
				]),
		new Wave([//11
				[Snowman, 25, 0.9, 0],
				[Yeti, 9, 2, 0],
				[Yeti, 9, 1.5, 18],
				[Snowman, 15, 0.7, 24],
				[Yeti, 3, 1, 32],
				[Snowman, 10, 0.6, 34]
				]),
		new Wave([//12
				[Yeti, 25, 1.5, 0],
				[Snowman, 50, 0.5, 10],
				[SnowAngel, 8, 2.5, 40]
				]),
		new Wave([//13
				[Yeti, 25, 1.5, 0],
				[Snowman, 100, 0.5, 0],
				[Yeti, 10, 1, 50]
				]),
		new Wave([//14
				[Yeti, 45, 1.3, 0],
				[SnowAngel, 10, 1.5, 27]
				]),
		new Wave([//15
				[Yeti, 30, 1, 0],
				[SnowAngel, 15, 1.5, 15],
				[Yeti, 20, 0.8, 30]
				]),
		new Wave([//16
				[SnowAngel, 80, 1, 0]
				]),
		new Wave([//17
				[Yeti, 40, 1.1, 0],
				[SnowAngel, 20, 1.1, 0],
				[Snowman, 40, 1.1, 0],
				]),
		new Wave([//18
				[Snowman, 10, 1, 0],
				[Yeti, 10, 1, 8],
				[SnowAngel, 10, 1, 16],
				[IceGolem, 5, 2, 24]
				]),
		new Wave([//19
				[SnowAngel, 25, 1, 0],
				[IceGolem, 7, 2, 15]
				]),
		new Wave([//20
				[IceGolem, 8, 10, 0],
				[SnowAngel, 30, 2.8, 0],
				[Yeti, 40, 2, 0],
				[Snowman, 80, 1, 0]
				]),
		new Wave([//21
				[Snowman, 90, 0.5, 0],
				[SnowAngel, 40, 1, 10],
				[Yeti, 28, 1, 20],
				[IceGolem, 5, 5, 30]
				])
	];
	inWave = false;
	readyForShop = true;
	waveCounter = 0;
	health;
	levelOver = false;
	
	constructor(map, path, canvas, enemies, shop) {
		this.map = map;
		this.path = path;	// Maybe read path from map?
		this.canvas = canvas;
		this.enemies = enemies;
		this.shop = shop;
		this.health = 100;
	}
	
	getLevelId() {
		return Level.MAPS.indexOf(this.map);
	}
	
	display() {
		Level.displayGeneric(this.canvas, this.map, 0, 0, 2);
		// draw money counter
	}
	
	static displayGeneric(canvas, map, x, y, scale) {
		let ctx = canvas.getContext("2d");
		for(let row = 0; row < map.length; row++) {
			for(let column = 0; column < map[row].length; column++) {
				let tile = map[row][column];
				if(typeof tile == "number") { tile = new Tile(tile); }
				tile.drawTile(canvas, x + column*Tile.TILE_SIZE*scale, y + row*Tile.TILE_SIZE*scale, scale);
			}
		}
	}
	
	getTile(x, y) {
		let row = Math.floor(y / (Tile.TILE_SIZE*2));
		let col = Math.floor(x / (Tile.TILE_SIZE*2));
		let tile = this.map[row][col];
		if(typeof tile == "number") { tile = new Tile(tile); }
		return tile;
	}
	
	reset() {
		for(let wave of this.waves) { wave.reset(); }
	}
	
	startWave() {
		if(this.waveCounter < this.waves.length) {
			closeShop();
			this.waves[this.waveCounter].start();
			this.inWave = true;
		}
	}
	
	// economy helpers
	// always keep money >= 0; operations that would produce a negative value
	// are clamped to zero.  this prevents the counter from dipping below 0 even
	// if a penalty is applied when the player lacks sufficient funds or if
	// external code accidentally calls addMoney with a negative amount.			:from Vova
	addMoney(amount) {
		this.money += amount;
		if (this.money < 0) {
			this.money = 0;
		}
	}
	// `canAfford` now also refuses purchases when the player has zero balance,
	// even if the cost is 0.  This mirrors the expectation that a player with no
	// money cannot "buy" anything.
	// We additionally treat non-positive costs as unaffordable to avoid
	// accidental giveaways from malformed data.									:from Vova
	canAfford(cost) {
		return cost > 0 && this.money >= cost;
	}
	spend(cost) {
		// spend relies on canAfford; if the balance is 0 this will automatically	:from Vova
		// return false and leave the money unchanged.
		if (this.canAfford(cost)) {
			this.money -= cost;
			if (this.money < 0) { // extra safety, though canAfford should prevent this
				this.money = 0;
			}
			return true;
		}
		return false;
	}
	
	update(duration) {
		if(this.inWave) {
			if(this.waveCounter < this.waves.length) {
				this.waves[this.waveCounter].update(duration);
				if(this.waves[this.waveCounter].ended) {
					this.money += Wave.REWARD;
					this.waveCounter++;
					this.inWave = false;
					this.readyForShop = true;
				}
			}
		}
		if(this.waveCounter == this.waves.length || this.health <= 0) {
			this.levelOver = true;
			this.readyForShop = false;
		}
	}
	
	
	spawnEnemy(Type) {
		this.enemies.push(new Type(0, 0, this.path));
	}
}