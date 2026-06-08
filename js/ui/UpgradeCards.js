// Author Philipp Locher
class UpgradeCard extends Card {
	static DEFAULT_STAT_NAME = "Stat name not found.";
	constructor (id, name, towerClass, statName, effectFn, amount, mode, cost, img, rate=1, description = '') {
		super (
		id,
		'upgrade',
		name,
		{
			description,
			towerType: towerClass,
			towerName: towerClass.NAME,
			statName,
			function: effectFn,
			amount,
			mode,
			cost
		},
		img,
		rate
		)
	}
}

class RangeCard extends UpgradeCard {
	static _STAT_NAMES = {
		"German":	"Reichweite",
		"English":	"Range"
	};
	static get STAT_NAME() {
		let statName = RangeCard._STAT_NAMES[Languages.language];
		if(statName == undefined) { return UpgradeCard.DEFAULT_STAT_NAME; }
		return statName;
	}
	static IMG_ID = "RANGE_UPGRADE_CARD";
	constructor(id, name, towerClass, amount, mode, cost, rate) {
		super(
		id,
		Card.DICT[name],
		towerClass,
		RangeCard.STAT_NAME,
		Tower.increaseRange,
		amount,
		mode,
		cost,
		document.getElementById(RangeCard.IMG_ID),
		rate,
		Card.RANGE_DESC
		);
	}
}

class SpeedCard extends UpgradeCard {
	static _STAT_NAMES = {
		"German":	"Geschwindigkeit",
		"English":	"Attack Speed"
	};
	static get STAT_NAME() {
		let statName = SpeedCard._STAT_NAMES[Languages.language];
		if(statName == undefined) { return UpgradeCard.DEFAULT_STAT_NAME; }
		return statName;
	}
	static IMG_ID = "SPEED_UPGRADE_CARD";
	constructor(id, name, towerClass, amount, mode, cost, rate) {
		super(
		id,
		Card.DICT[name],
		towerClass,
		SpeedCard.STAT_NAME,
		Tower.increaseAttackSpeed,
		amount,
		mode,
		cost,
		document.getElementById(SpeedCard.IMG_ID),
		rate,
		Card.SPEED_DESC
		);
	}
}

// penguin snowball tower
class PenguinRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'penguin_range_small',	// id
			'RangeSmall',			// name
			Penguin,				// tower class	
			40,						// amount
			'total',				// mode
			20,						// cost
			3,						// rate
		)
	}
}

class PenguinRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'penguin_range_epic',	// id
			'RangeEpic',				// name
			Penguin,				// tower class
			80,						// amount
			'total',				// mode
			40,						// cost
			2,						// rate
		)
	}
}

class PenguinSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'penguin_speed_small',		// id
			'SpeedSmall', 		// name
			Penguin, 					// tower class
			15,							// amount
			'%',						// mode
			35,							// cost
			3,							// rate
		)
	}
}

class PenguinSpeedEpicCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'penguin_speed_epic',		// id
			'SpeedEpic', 		// name
			Penguin, 					// tower class
			30,							// amount
			'%',						// mode
			60,							// cost
			2,							// rate
		)
	}
}

// PineconeGunner tower
class PineconeRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'pinecone_range_small',	// id
			'RangeSmall',			// name
			PineconeGunner,			// tower class
			40,						// amount
			'total',				// mode
			30,						// cost
			2,						// rate
		)
	}
}

class PineconeRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'pinecone_range_epic',	// id
			'RangeEpic',			// name
			PineconeGunner,			// tower class
			80,						// amount
			'total',				// mode
			60,						// cost
			1,						// rate
		)
	}
}

class PineconeSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'pinecone_speed_small',		// id
			'SpeedSmall', 		// name
			PineconeGunner, 			// tower class
			15,							// amount
			'%',						// mode
			30,							// cost
			2,							// rate
		)
	}
}

class PineconeSpeedEpicCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'pinecone_speed_epic',		// id
			'SpeedEpic', 		// name
			PineconeGunner, 			// tower class
			30,							// amount
			'%',						// mode
			60,							// cost
			1,							// rate
		)
	}
}

class PineconePierceCard extends UpgradeCard {
	static { CardRegistry.register(this); }
	
	constructor() {
		super(
			'pinecone_pierce',			// id
			'Durchschuss',				// name
			PineconeGunner,				// tower class
			'Durchschuss',				// stat name
			PineconeGunner.increasePierce,
			2,							// amount
			'total',					// mode
			50,							// cost
			document.getElementById('PIERCE_UPGRADE_CARD'),
			3,							// rate
			Card.PIERCE_DESC			// bubble description
		);
	}
}

// Catapult tower
class CatapultRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'catapult_range_small',	// id
			'RangeSmall',			// name
			Catapult,				// tower class
			45,						// amount
			'total',				// mode
			40,						// cost
			2,						// rate
		)
	}
}

class CatapultRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'catapult_range_epic',	// id
			'RangeEpic',			// name
			Catapult,				// tower class
			90,						// amount
			'total',				// mode
			80,						// cost
			1,						// rate
		)
	}
}

class CatapultSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'catapult_speed_small',		// id
			'SpeedSmall', 		// name
			Catapult, 					// tower class
			20,							// amount
			'%',						// mode
			50,							// cost
			3,							// rate
		)
	}
}

class CatapultSpeedEpicCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'catapult_speed_epic',		// id
			'SpeedEpic', 		// name
			Catapult, 					// tower class
			40,							// amount
			'%',						// mode
			100,							// cost
			1,							// rate
		)
	}
}

// SnowballGun tower
class SnowballGunRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'snowballgun_range_small',	// id
			'RangeSmall',			// name
			SnowballGun,			// tower class
			30,						// amount
			'total',				// mode
			40,						// cost
			2,						// rate
		)
	}
}

class SnowballGunRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'snowballgun_range_epic',	// id
			'RangeEpic',		// name
			SnowballGun,			// tower class
			70,						// amount
			'total',				// mode
			80,						// cost
			1,						// rate
		)
	}
}

class SnowballGunSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'snowballgun_speed_small',	// id
			'SpeedSmall', 		// name
			SnowballGun, 				// tower class
			20,							// amount
			'%',						// mode
			40,							// cost
			2,							// rate
		)
	}
}

class SnowballGunSpeedEpicCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'snowballgun_speed_epic',	// id
			'SpeedEpic', 		// name
			SnowballGun, 				// tower class
			40,							// amount
			'%',						// mode
			80,							// cost
			1,							// rate
		)
	}
}

// IceMage tower
class IceMageRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'icemage_range_small',	// id
			'RangeSmall',	// name
			IceMage,				// tower class
			35,						// amount
			'total',				// mode
			40,						// cost
			2,						// rate
		)
	}
}

class IceMageRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'icemage_range_epic',	// id
			'RangeEpic',		// name
			IceMage,				// tower class
			70,						// amount
			'total',				// mode
			70,						// cost
			1,						// rate
		)
	}
}

class IceMageSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'icemage_speed_small',	// id
			'SpeedSmall', 		// name
			IceMage, 					// tower class
			20,							// amount
			'%',						// mode
			45,							// cost
			2,							// rate
		)
	}
}

class IceMageSpeedEpicCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'icemage_speed_epic',	// id
			'SpeedEpic', 		// name
			IceMage, 				// tower class
			35,							// amount
			'%',						// mode
			80,							// cost
			1,							// rate
		)
	}
}

// Superpenguin tower, Author: Jeremias Möller
class SuperPenguinRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'superpenguin_range_small',	// id
			'RangeSmall',	// name
			Superpenguin,				// tower class
			40,						// amount
			'total',				// mode
			100,							// cost
			2,						// rate
		)
	}
}

class SuperPenguinRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'superpenguin_range_epic',	// id
			'RangeEpic',		// name
			Superpenguin,				// tower class
			80,						// amount
			'total',				// mode
			190,							// cost
			1,						// rate
		)
	}
}

class SuperPenguinSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'superpenguin_speed_small',	// id
			'SpeedSmall', 		// name
			Superpenguin, 					// tower class
			20,							// amount
			'%',						// mode
			100,							// cost
			2,							// rate
		)
	}
}

class SuperPenguinSpeedEpicCard extends SpeedCard {

	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'superpenguin_speed_epic',	// id
			'SpeedEpic', 		// name
			Superpenguin, 				// tower class
			40,							// amount
			'%',						// mode
			200,							// cost
			1,							// rate
		)
	}
}

// Fisher Tower
class FisherRangeSmallCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'fisher_range_small',	// id
			'RangeSmall',	// name
			Fisher,					// tower class
			40,						// amount
			'total',				// mode
			40,						// cost
			2,						// rate
		)
	}
}

class FisherRangeEpicCard extends RangeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'fisher_range_epic',	// id
			'RangeEpic',		// name
			Fisher,					// tower class
			80,						// amount
			'total',				// mode
			80,						// cost
			1,						// rate
		)
	}
}

class FisherSpeedSmallCard extends SpeedCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'fisher_speed_small',		// id
			'SpeedSmall', 	// name
			Fisher, 					// tower class
			30,							// amount
			'%',						// mode
			50,							// cost
			2,							// rate
		)
	}
}

class FisherTrouterangCard extends UpgradeCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'fisher_trouterang',		// id
			'Forellerang',		 		// name
			Fisher,						// tower class
			'Forellerang Anzahl',		// stat name
			Fisher.increaseTrouterangCount,
			1,							// amount
			'total',					// mode
			200,							// cost
			document.getElementById('TROUTERANG_UPGRADE_CARD'),
			2,							// rate
			Card.TROUTERANG_DESC		// bubble description
		)
	}
}