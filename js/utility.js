// Author: Timo Lauterbach
class Util {
	static mouseX = 0; 
	static mouseY = 0;
	
	// Returns the distance between two given points in a 2D space
	static getDistance(point1, point2) {
		return Math.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2);
	}
	
	// Returns the angle as Radian based on a normalised vector
	static getAngle(vecX, vecY) {
		return Math.atan2(vecY, vecX);
	}
	
	// Returns a normalised vector as array of x and y value based on an angle
	static getDirection(angle) {
		let ratio = Math.tan(angle);
		let x = 1;
		if(ratio < 0) { ratio = -ratio; x *= -1; }
		if(angle > Math.PI) { ratio = -ratio; x *= -1; }
		return Util.normalise(x, ratio);
	}
	
	// Normalises a vector to a length of 1
	static normalise(vecX, vecY) {
		let length = Math.sqrt(vecX**2 + vecY**2);
		return [vecX / length, vecY / length];
	}
	
	// Returns the vector orthogonal (=in a 90° angle) to the one passed as argument
	static getOrthogonalVector(vec) {
		return [-vec[1], vec[0]];
	}
	
	// accepts a line in vectorial representation as parameters and returns the slope and offset for 
	static fromVecToCartesian(baseX, baseY, dirX, dirY) {
		if(dirX == 0) { dirX = 0.001; }	// not exactly a good solution, but it prevents dividing by 0 and dealing with Infinitiy... and it beats having to deal with vectors
		let slope = dirY / dirX;
		let offset = baseY - (baseX * slope);
		return [slope, offset];
	}
	
	// Returns the intersection point of two lines in a 2D space. Accepts the slope and offset of a line as parameter (non-vectorial representation)
	static getIntersection(slope1, offset1, slope2, offset2) {
		/*	m1*x + b1 = m2*x +b2
		<=> m1*x - m2*x = b2 - b1
		<=> (m1 - m2)*x = (b2 - b1)
		<=> x = (b2 -b1) / (m1 - m2)*/
		let x = (offset2 - offset1) / (slope1 - slope2);
		return [x, slope1 * x + offset1];
	}
	
	// Philipp Mausbewegung erfassen und Positionen bestimmen
	
		
	static mousePos(canvas){
		window.addEventListener('mousemove', Util.handleMouseMove);
	}
	
	static removeMousePos(canvas){
		window.removeEventListener('mousemove', Util.handleMouseMove);
	}
	
	static handleMouseMove(event){
		Util.mouseX = event.clientX;
		Util.mouseY = event.clientY;
	}
}