// Author: Philipp Locher
class TowerCard extends Card {
	constructor(id, towerClass, img, rate=1) {
		super(
			id, 
			'tower',
			towerClass.NAME, 
			{
					description: towerClass.DESC, 
					towerType: towerClass, 
					range: towerClass.RANGE, 
					attackSpeed: towerClass.ATTACK_SPEED,
					cost: towerClass.COST
			},
			img, 
			rate
		);
	}
}

class PenguinCard extends TowerCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'tower_basic',
			Penguin,
			document.getElementById('PENGUIN_CARD'),
			8
		);
	}
}

class PineconeGunnerCard extends TowerCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'pinecone_gunner',
			PineconeGunner,
			document.getElementById('PINECONEGUNNER_CARD'),
			6
		);
	}
}

class CatapultCard extends TowerCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'catapult',
			Catapult,
			document.getElementById('CATAPULT_CARD'),
			4
		);
	}
}

class SnowballGunCard extends TowerCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'snowballgun',
			SnowballGun,
			document.getElementById('SNOWBALLGUN_CARD'),
			6
		);
	}
}

class IceMageCard extends TowerCard {
	static { CardRegistry.register(this);}
	
	constructor() {
		super(
			'ice_mage',
			IceMage,
			document.getElementById('ICEMAGE_CARD'),
			5
		);
	}
}

// Class by Jeremias
class SuperpenguinCard extends TowerCard {
	static { CardRegistry.register(this);}

	constructor() {
		super(
			'super_penguin',
			Superpenguin,
			document.getElementById('SUPERPENGUIN_CARD'),
			4
		);
	}
}

class FisherCard extends TowerCard {
	static { CardRegistry.register(this); }
	
	constructor() {
		super(
			'fisher',
			Fisher,
			document.getElementById('FISHER_CARD'),
			5
		);
	}
}