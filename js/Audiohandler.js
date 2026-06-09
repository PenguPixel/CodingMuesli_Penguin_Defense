class Audiohandler {
	static MAX_SOUND_EFFECTS = 15; // Ein bisschen Puffer für Welle 20+
	static pool = [];

	// Initialisiert den Pool einmalig beim Spielstart
	static init() {
		for (let i = 0; i < Audiohandler.MAX_SOUND_EFFECTS; i++) {
			let audioNode = document.createElement("audio");
			Audiohandler.pool.push(audioNode);
		}
	}

	// Spielt einen Sound ab, indem ein freies oder das älteste Element genutzt wird
	static play(audioInput, volume = 1.0) {
		const MAX_VOLUME_LIMIT = 0.3;
		// Sicherheits-Check: Wenn ein Objekt übergeben wurde, nimm dessen .src
		let src = (audioInput && typeof audioInput === 'object') ? audioInput.src : audioInput;

		// Falls src immer noch leer oder ungültig ist, brechen wir ab
		if (!src || src.includes("[object")) {
			console.warn("Audiohandler: Ungültiger Audio-Pfad übergeben:", audioInput);
			return;
		}

		// Sucht ein Audio-Element, das gerade Pause hat oder fertig ist
		let availableAudio = Audiohandler.pool.find(audio => audio.paused || audio.ended);

		// Falls alle Kanäle besetzt sind, klauen wir uns das erste
		if (!availableAudio) {
			availableAudio = Audiohandler.pool[0];
			availableAudio.pause();
		}
		// Sound aktualisieren und abspielen
		availableAudio.src = src;

		let finalVolume = volume * MAX_VOLUME_LIMIT;
		availableAudio.volume = Math.min(finalVolume, MAX_VOLUME_LIMIT);

		availableAudio.currentTime = 0;

		availableAudio.play().catch(e => {
			// Das ist der Log aus deinem Screenshot: Völlig normal bei extrem hohem Game-Speed!
			// Verhindert nur, dass der Browser eine rote Fehlermeldung wirft.
		});
	}
}