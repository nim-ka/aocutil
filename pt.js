class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	equals(pt) { return this.x == pt.x && this.y == pt.y }
	isIn(arr) { return this.indexIn(arr) != -1 }
	indexIn(arr) { return arr.findIndex((pt) => this.equals(pt)) }
	lastIndexIn(arr) { return arr.findLastIndex((pt) => this.equals(pt)) }

	up() { return new Point(this.x, this.y - 1) }
	down() { return new Point(this.x, this.y + 1) }
	left() { return new Point(this.x - 1, this.y) }
	right() { return new Point(this.x + 1, this.y) }
	upleft() { return new Point(this.x - 1, this.y - 1) }
	upright() { return new Point(this.x + 1, this.y - 1) }
	downleft() { return new Point(this.x - 1, this.y + 1) }
	downright() { return new Point(this.x + 1, this.y + 1) }

	u() { return this.up() }
	d() { return this.down() }
	l() { return this.left() }
	r() { return this.right() }
	ul() { return this.upleft() }
	ur() { return this.upright() }
	dl() { return this.downleft() }
	dr() { return this.downright() }

	getUnfilteredAdjNeighbors() { return [this.u(), this.l(), this.r(), this.d()] }
	getUnfilteredDiagNeighbors() { return [this.ul(), this.ur(), this.dl(), this.dr()] }
	getUnfilteredAllNeighbors() { return [this.ul(), this.u(), this.ur(), this.l(), this.r(), this.dl(), this.d(), this.dr()] }
	getUnfilteredAdjNeighborsIncSelf() { return [this.u(), this.l(), this, this.r(), this.d()] }
	getUnfilteredDiagNeighborsIncSelf() { return [this.ul(), this.ur(), this, this.dl(), this.dr()] }
	getUnfilteredAllNeighborsIncSelf() { return [this.ul(), this.u(), this.ur(), this.l(), this, this.r(), this.dl(), this.d(), this.dr()] }

	add(pt) { return new Point(this.x + pt.x, this.y + pt.y) }
	addMut(pt) {
		this.x += pt.x
		this.y += pt.y
		return this
	}

	sub(pt) { return new Point(this.x - pt.x, this.y - pt.y) }
	subMut(pt) {
		this.x -= pt.x
		this.y -= pt.y
		return this
	}

	squaredMag() { return this.x * this.x + this.y * this.y }
	mag() { return Math.sqrt(this.squaredMag()) }

	squaredDist(pt) { return this.sub(pt).squaredMag() }
	dist(pt) { return this.sub(pt).mag() }

	readingOrderCompare(pt) { return this.y < pt.y ? -1 : this.y > pt.y ? 1 : this.x < pt.x ? -1 : this.x > pt.x ? 1 : 0 }

	copy() { return new Point(this.x, this.y) }
	toString() { return this.x + "," + this.y }
}

Pt = Point

function P(...args) {
	return new Point(...args)
}


