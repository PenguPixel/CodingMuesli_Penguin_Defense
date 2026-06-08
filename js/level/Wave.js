// Author:	Timo Lauterbach
//			Volodymyr Velychko: Gegner Spawnen angepasst
class Wave {
	static REWARD = 40;
	
	entries = [
		/* Array of Objects:
		{	"Class": Enemy Class,
			"amount": integer,
			"interval": delay inbetween entries,		// delay in seconds
			"start": total delay from start,
			"amountSent": amount of entries already sent
		}*/
	];
	
	static level;		// gets set to the current level from the main script
	totalDuration = 0;
	started = false;
	ended = false;
	
	constructor(entries = []) {	// entries is an array of shorter arrays containing four values for Class, amount, interval and start point
		for(let entry of entries) {
			this.entries.push({"Class": entry[0], "amount": entry[1], "interval": entry[2], "start": entry[3], "amountSent": 0});
		}
	}
	
	addEntry(Class, amount, interval, start) {
		this.entries.push({"Class": Class, "amount": amount, "interval": interval, "start": start, "amountSent": 0});
	}
	
	reset() {
		this.started = false;
		this.totalDuration = 0;
		for(let entry of this.entries) {
			entry["timePassed"] = 0;
			entry["amountSent"] = 0;
		}
		this.ended = false;
	}
	
	start() {
		if(Wave.level && Wave.level.enemies && Wave.level.path) {
			this.started = true;
	//		console.log("wave started (Wave)");
		}
	}
	
	update(duration) {
		if(this.started) {
		//	console.log("getting updated (Wave)");
			let ended = true;
			for(let entry of this.entries) {
		//		console.log(entry);
				if(entry["amount"] > entry["amountSent"]) { ended = false; }
				else { continue; }
				if(this.totalDuration >= entry["start"]) {
					let sinceLast = this.totalDuration - entry["start"] - (entry["interval"] * entry["amountSent"]);
					let amountToSend = Math.ceil(sinceLast / entry["interval"]);	// This way of calculating time and when to spawn enemies will occasionally spawn multiple enemies at once if the interval is set to below what the framerate provides. Might require further thinking to change approach without using setTimeout. (Because setTimeout is not under the programmers control the way the value of duration is. Relevant for both debugging and pausing)
					for(let i = 0; i < amountToSend; i++) {	// If we change the way this is calculated and enemies are spawned this entire function has to be reworked
						let EnemyClass = entry["Class"];
						let pos = Wave.level.path.start;
						// Volodymyr:
						const e = new EnemyClass(pos[0], pos[1], Wave.level.path);
						e.level = Wave.level;
						Wave.level.enemies.push(e);
						// :Volodymyr
						entry["amountSent"]++;
					}
				}
			}
			if(ended && Wave.level.enemies.length == 0) {
				this.ended = true;
			}
			this.totalDuration += duration;
		}
	}
}