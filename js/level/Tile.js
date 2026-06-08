// Author: Timo Lauterbach
class Tile {
	static TILE_SIZE = 32;
	static TILESET;			// Png of tileset
	static TILES =			// Position of tile with a given id in the tileset
		[
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
			[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
			[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
			[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
			[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
			[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5]
		];
	static TILE_TYPES =
		{
			types: ["G", "W", "GW"],
			"G": [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
			"W": [9],
			"GW": [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
		};
	static backgroundCv;
	
	backgroundId;
	decorationIds;
	
	constructor(backgroundId, decorationIds = []) {
		this.backgroundId = backgroundId;
		this.decorationIds = decorationIds;
	}
	
	drawTile(canvas, x, y, scale) {
		let ctx = canvas.getContext("2d");
		let tmpIds = this.decorationIds.slice();
		tmpIds.unshift(this.backgroundId);
		for(let id of tmpIds) {
			let tilePos = Tile.TILES[id];
			ctx.drawImage(Tile.TILESET, tilePos[0]*Tile.TILE_SIZE, tilePos[1]*Tile.TILE_SIZE, Tile.TILE_SIZE, Tile.TILE_SIZE,
						x, y, Tile.TILE_SIZE*scale, Tile.TILE_SIZE*scale);
		}
	}
	
	getTileTypes() {
		let types = [];
		let tmpIds = this.decorationIds.slice();
		tmpIds.unshift(this.backgroundId);
		for(let id of tmpIds) {
			for(let type of Tile.TILE_TYPES.types) {
				if((Tile.TILE_TYPES[type].indexOf(id) != -1) && (types.indexOf(type) == -1)) {
					types.push(type);
				}
			}
		}
		return types;
	}
}