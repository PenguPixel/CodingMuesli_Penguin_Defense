// Author: Timo Lauterbach
class Audiohandler {
	static MAX_SOUND_EFFECTS = 10;
	static sounds = [];
	
	static requestAudio(audio) {
		if(Audiohandler.sounds.length < Audiohandler.MAX_SOUND_EFFECTS) {
			Audiohandler.sounds.push(audio);
			audio.play();
		}
	}
	
	static update() {
		for(let i = 0; i < Audiohandler.sounds.length; i++) {
			if(Audiohandler.sounds[i].ended) {
				Audiohandler.sounds.splice(i, 1);
				i--;
			}
		}
	}
}