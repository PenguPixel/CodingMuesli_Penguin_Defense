class Segment {
	static UNPLACABLE_RADIUS = 52;
	start;
	end;
	direction;
	unplacableRadius
	
	constructor(start, end, unplacableRadius = Segment.UNPLACABLE_RADIUS) {
		this.start = start;
		this.end = end;
		this.direction = Util.normalise(end[0]-start[0], end[1]-start[1]);
		this.unplacableRadius = unplacableRadius;
	}
	
	getPoint(progress) {
		return [this.start[0] + progress * this.direction[0], this.start[1] + progress * this.direction[1], this.direction[0], this.direction[1]];
	}
	
	/* returns a boolean whether or not a tower may be placed on a given point based on whether or not it overlaps with this segment of the path.
		Works regardless of orientation of this segment, whether it's facing a cardinal direction or not*/
	isPointPlacable(x, y) {
		// Extends the segment by the length of where a tower my not be placed to prevent being able to place towers directly at corners
		let start = [this.start[0] - this.direction[0] * this.unplacableRadius, this.start[1] - this.direction[1] * this.unplacableRadius];
		let end = [this.end[0] + this.direction[0] * this.unplacableRadius, this.end[1] + this.direction[1] * this.unplacableRadius];
		// calculate distance between the passed point and the line created by this segment
		let orthVec = Util.getOrthogonalVector(this.direction);
		let lineThis = Util.fromVecToCartesian(start[0], start[1], this.direction[0], this.direction[1]);	// returns the slope and offset of the line
		let lineOrth = Util.fromVecToCartesian(x, y, orthVec[0], orthVec[1]);								// so if line: y = mx + b => returns [m, b]
		let intersection = Util.getIntersection(lineThis[0], lineThis[1], lineOrth[0], lineOrth[1])				// returns point where the two lines interect
		// check if the distance between the passed point and the intersection point (which is the closest point on the line) is within the unplacable zone
		let distance = Util.getDistance([x, y], intersection);
		if(distance < this.unplacableRadius) {
			// check if the point is actually near the line of this particular segment and not off in the distance
			// check if point is before the start
			let angleThis = Util.getAngle(this.direction[0], this.direction[1]);
			let vecToPoint = Util.normalise(x - start[0], y - start[1]);
			let angleToPoint = Util.getAngle(vecToPoint[0], vecToPoint[1]);
			let angleDif = angleToPoint - angleThis;
			if(angleDif < 0) { angleDif += 2*Math.PI; }
			if((angleDif >= Math.PI/2) && (angleDif < 3*Math.PI/2)) {
				return true;
			}
			// check if point is behind the end
			angleThis = Util.getAngle(-this.direction[0], -this.direction[1]);
			vecToPoint = Util.normalise(x - end[0], y - end[1]);
			angleToPoint = Util.getAngle(vecToPoint[0], vecToPoint[1]);
			angleDif = angleToPoint - angleThis;
			if(angleDif < 0) { angleDif += 2*Math.PI; }
			if((angleDif >= Math.PI/2) && (angleDif < 3*Math.PI/2)) {
				return true;
			}
			// Tower is within the unplacable zone and may not be placed
			return false;
		}
		return true;
	}
	
	get length() { return Math.sqrt((this.end[0] - this.start[0])**2 + (this.end[1] - this.start[1])**2); }
}

class Path {
	// Autor: Jeremias Möller
	static PATH_0 = [
		new Segment([-32, 250], [840, 250]), //Rechts, Höhe
		new Segment([830, 250], [830, 76]),
		new Segment([830, 76], [830, 60]),
		new Segment([830, 60], [640, 60]),
		new Segment([640, 60], [640, 640]),
		new Segment([640, 640], [640, 640]),
		new Segment([640, 640], [832, 640]),
		new Segment([832, 640], [832, 450]),
		new Segment([832, 444], [64, 444]),
		new Segment([64, 444], [64, 640]),
		new Segment([64, 640], [256, 640]),
		new Segment([256, 640], [256, -20])
	];
	// Autor: Jeremias Möller
	static PATH_1 = [
		new Segment([190, -20], [190, 250]),//Rechts, Höhe
		new Segment([190, 250], [320, 250]),
		new Segment([320, 250], [320, 190]),
		new Segment([320, 190], [384, 190]),
		new Segment([384, 190], [384, 124]),
		new Segment([384, 124], [510, 124]),
		new Segment([510, 124], [510, 190]),
		new Segment([510, 190], [566, 190]),
		new Segment([566, 190], [566, 250]),
		new Segment([566, 250], [1152, 250]),
		new Segment([1152, 250], [1152, 444]),
		new Segment([1152, 444], [960, 444]),
		new Segment([960, 444], [960, 512]),
		new Segment([960, 512], [896, 512]),
		new Segment([896, 512], [896, 566]),
		new Segment([896, 566], [896, 566]),
		new Segment([896, 566], [768, 566]),
		new Segment([768, 566], [768, 512]),
		new Segment([768, 512], [768, 512]),
		new Segment([768, 512], [704, 512]),
		new Segment([704, 512], [704, 444]),
		new Segment([704, 444], [140, 444]),
		new Segment([130, 444], [130, 736])
	];
	static PATH_2 = [
		new Segment([-32, 64], [320, 64]),
		new Segment([320, 64], [320, 320]),
		new Segment([320, 320], [512, 320]),
		new Segment([512, 320], [512, 256]),
		new Segment([512, 256], [832, 256]),
		new Segment([832, 256], [832, 512]),
		new Segment([832, 512], [192, 512]),
		new Segment([192, 512], [192, 736]),
	];
	static PATHS = [Path.PATH_0, Path.PATH_1, Path.PATH_2];
	segments;	// Notates the path in corner points with straight lines inbetween
	length;
	
	constructor(segments) {
		this.segments = segments;
		this.length = 0;
		for(let segment of this.segments) {
			this.length += segment.length;
		}
	}
	
	//DEBUG PURPOSES:
	display(cv) {
		let ctx = cv.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(this.segments[0].start[0], this.segments[0].start[1]);
		for(let i = 0; i < this.segments.length; i++) {
			ctx.lineTo(this.segments[i].end[0], this.segments[i].end[1]);
		}
		//ctx.closePath();
		ctx.stroke();
	}
	
	// Returns the point in coordinates that is a given progress on the path in pixels
	getPoint(progress) {
		for(let segment of this.segments) {
			if(progress > segment.length) {
				progress -= segment.length;
			} else {
				return segment.getPoint(progress);
			}
		}
		let end = this.segments[this.segments.length - 1].end;
		return [end[0], end[1], 0, 1];
	}
	
	isAtEnd(progress) {
		return progress >= this.length;
	}
	
	isPointPlacable(x, y) {
		for(let segment of this.segments) {
			if(!segment.isPointPlacable(x, y)) { return false; }
		}
		return true;
	}
	
	get start() { return this.segments[0].start; }
}