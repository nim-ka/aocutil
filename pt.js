Pt = Point = class Point {
	static STRING = true

	constructor(x, y, z) {
		this.is3D = z != undefined
		this.x = x
		this.y = y
		this.z = z
	}

	equals(pt) { return this.x == pt.x && this.y == pt.y && (!this.is3D || this.z == pt.z) }

	static encode2D(pt, width = 15) {
		if (pt.is3D) {
			throw `Point.encode2D: Use encode3D for 3D points`
		}

		let x = Math.abs(pt.x)
		let y = Math.abs(pt.y)
		let nx = x != pt.x
		let ny = y != pt.y

		if (x >= 1 << width || y >= 1 << width) {
			throw `Point.encode2D: Tried to encode point out of range: ${pt.x}, ${pt.y}`
		}

		return ((ny << 1 | nx) << width | y) << width | x
	}

	static encode3D(pt, width = 9) {
		if (!pt.is3D) {
			throw `Point.encode3D: Use encode2D for 2D points`
		}

		let x = Math.abs(pt.x)
		let y = Math.abs(pt.y)
		let z = Math.abs(pt.z)
		let nx = x != pt.x
		let ny = y != pt.y
		let nz = z != pt.z

		if (x >= 1 << width || y >= 1 << width || z >= 1 << width) {
			throw `Point.encode3D: Tried to encode point out of range: ${pt.x}, ${pt.y}, ${pt.z}`
		}

		return (((nz << 2 | ny << 1 | nx) << width | z) << width | y) << width | x
	}

	static encode(pt, width) {
		return pt.is3D ? Point.encode3D(pt, width) : Point.encode2D(pt, width)
	}

	encode2D(width) { return Point.encode2D(this, width) }
	encode3D(width) { return Point.encode3D(this, width) }
	encode(width) { return Point.encode(this, width) }

	static decode2D(num, width = 15) {
		num = +num

		if (Number.isNaN(num)) {
			return null
		}

		let mask = (1 << width) - 1

		let x = num & mask
		num >>>= width
		let y = num & mask
		num >>>= width
		let nx = num & 1
		num >>>= 1
		let ny = num & 1

		return new Point(nx ? -x : x, ny ? -y : y)
	}

	static decode3D(num, width = 9) {
		num = +num

		if (Number.isNaN(num)) {
			return null
		}

		let mask = (1 << width) - 1

		let x = num & mask
		num >>>= width
		let y = num & mask
		num >>>= width
		let z = num & mask
		num >>>= width
		let nx = num & 1
		num >>>= 1
		let ny = num & 1
		num >>>= 1
		let nz = num & 1

		return new Point(nx ? -x : x, ny ? -y : y, nz ? -z : z)
	}

	static decode(num, is3D = false, width) {
		return is3D ? Point.decode3D(num, width) : Point.decode2D(num, width)
	}

	isIn(arr) { return this.indexIn(arr) != -1 }
	indexIn(arr) { return arr.findIndex((pt) => this.equals(pt)) }
	lastIndexIn(arr) { return arr.findLastIndex((pt) => this.equals(pt)) }

	up(n = 1) { return new Point(this.x, this.y - n, this.z) }
	down(n = 1) { return new Point(this.x, this.y + n, this.z) }
	left(n = 1) { return new Point(this.x - n, this.y, this.z) }
	right(n = 1) { return new Point(this.x + n, this.y, this.z) }
	upleft(n = 1) { return new Point(this.x - n, this.y - n, this.z) }
	upright(n = 1) { return new Point(this.x + n, this.y - n, this.z) }
	downleft(n = 1) { return new Point(this.x - n, this.y + n, this.z) }
	downright(n = 1) { return new Point(this.x + n, this.y + n, this.z) }
	above(n = 1) { return new Point(this.x, this.y, this.z - n) }
	below(n = 1) { return new Point(this.x, this.y, this.z + n) }
	
	upMut(n = 1) { this.y -= n; return this }
	downMut(n = 1) { this.y += n; return this }
	leftMut(n = 1) { this.x -= n; return this }
	rightMut(n = 1) { this.x += n; return this }
	upleftMut(n = 1) { this.x -= n; this.y -= n; return this }
	uprightMut(n = 1) { this.x += n; this.y -= n; return this }
	downleftMut(n = 1) { this.x -= n; this.y += n; return this }
	downrightMut(n = 1) { this.x += n; this.y += n; return this }
	aboveMut(n = 1) { this.z -= n; return this }
	belowMut(n = 1) { this.z += n; return this }

	u(n) { return this.up(n) }
	d(n) { return this.down(n) }
	l(n) { return this.left(n) }
	r(n) { return this.right(n) }
	ul(n) { return this.upleft(n) }
	ur(n) { return this.upright(n) }
	dl(n) { return this.downleft(n) }
	dr(n) { return this.downright(n) }

	n(n) { return this.up(n) }
	s(n) { return this.down(n) }
	w(n) { return this.left(n) }
	e(n) { return this.right(n) }
	nw(n) { return this.upleft(n) }
	ne(n) { return this.upright(n) }
	sw(n) { return this.downleft(n) }
	se(n) { return this.downright(n) }

	getUnfilteredAdjNeighborsIncSelf() {
		if (!this.is3D) {
			return new PointArray(
				this.u(),
				this.l(),
				this.copy(),
				this.r(),
				this.d())
		} else {
			return new PointArray(
				this.above(),
				this.u(),
				this.l(),
				this.copy(),
				this.r(),
				this.d(),
				this.below())
		}
	}

	getUnfilteredWingNeighborsIncSelf() {
		if (!this.is3D) {
			throw "Can't get wing neighbors of 2D point"
		}

		return new PointArray(
			this.u().above(),
			this.l().above(),
			this.r().above(),
			this.d().above(),
			this.ul(),
			this.ur(),
			this.copy(),
			this.dl(),
			this.dr(),
			this.u().below(),
			this.l().below(),
			this.r().below(),
			this.d().below())
	}

	getUnfilteredDiagNeighborsIncSelf() {
		if (!this.is3D) {
			return new PointArray(
				this.ul(),
				this.ur(),
				this.copy(),
				this.dl(),
				this.dr())
		} else {
			return new PointArray(
				this.ul().above(),
				this.ur().above(),
				this.dl().above(),
				this.dr().above(),
				this.copy(),
				this.ul().below(),
				this.ur().below(),
				this.dl().below(),
				this.dr().below())
		}
	}

	getUnfilteredAllNeighborsIncSelf() {
		if (!this.is3D) {
			return new PointArray(
				this.ul(),
				this.u(),
				this.ur(),
				this.l(),
				this.copy(),
				this.r(),
				this.dl(),
				this.d(),
				this.dr())
		} else {
			return new PointArray(
				this.ul().above(),
				this.u().above(),
				this.ur().above(),
				this.l().above(),
				this.above(),
				this.r().above(),
				this.dl().above(),
				this.d().above(),
				this.dr().above(),
				this.ul(),
				this.u(),
				this.ur(),
				this.l(),
				this.copy(),
				this.r(),
				this.dl(),
				this.d(),
				this.dr(),
				this.ul().below(),
				this.u().below(),
				this.ur().below(),
				this.l().below(),
				this.below(),
				this.r().below(),
				this.dl().below(),
				this.d().below(),
				this.dr().below())
		}
	}

	getUnfilteredAdjNeighbors() { return this.getUnfilteredAdjNeighborsIncSelf().filter((pt) => !this.equals(pt)) }
	getUnfilteredDiagNeighbors() { return this.getUnfilteredDiagNeighborsIncSelf().filter((pt) => !this.equals(pt)) }
	getUnfilteredAllNeighbors() { return this.getUnfilteredAllNeighborsIncSelf().filter((pt) => !this.equals(pt)) }

	cw90() {
		if (this.is3D) {
			throw "Point.cw90: Can't rotate 3D point"
		}

		return new Point(-this.y, this.x)
	}

	cw90Mut() {
		if (this.is3D) {
			throw "Point.cw90Mut: Can't rotate 3D point"
		}

		[this.x, this.y] = [-this.y, this.x]
		return this
	}

	ccw90() {
		if (this.is3D) {
			throw "Point.ccw90: Can't rotate 3D point"
		}

		return new Point(this.y, -this.x)
	}

	ccw90Mut() {
		if (this.is3D) {
			throw "Point.ccw90Mut: Can't rotate 3D point"
		}

		[this.x, this.y] = [this.y, -this.x]
		return this
	}

	mutate(pt) {
		this.is3D = pt.is3D
		this.x = pt.x
		this.y = pt.y
		this.z = pt.z

		return this
	}

	add(pt) { return new Point(this.x + pt.x, this.y + pt.y, this.is3D ? this.z + pt.z : undefined) }
	addMut(pt) {
		this.x += pt.x
		this.y += pt.y

		if (this.is3D) {
			this.z += pt.z
		}

		return this
	}

	sub(pt) { return new Point(this.x - pt.x, this.y - pt.y, this.is3D ? this.z - pt.z : undefined) }
	subMut(pt) {
		this.x -= pt.x
		this.y -= pt.y

		if (this.is3D) {
			this.z -= pt.z
		}

		return this
	}

	mult(n) { return new Point(this.x * n, this.y * n, this.is3D ? this.z * n : undefined) }
	multMut(n) {
		this.x *= n
		this.y *= n

		if (this.is3D) {
			this.z *= n
		}

		return this
	}

	neg(n) { return this.mult(-1) }
	negMut(n) { return this.multMut(-1) }

	squaredMag() { return this.x * this.x + this.y * this.y + (this.is3D ? this.z * this.z : 0) }
	mag() { return Math.sqrt(this.squaredMag()) }

	norm() { return this.mult(1 / this.mag()) }
	normMut() { return this.multMut(1 / this.mag()) }

	squaredDist(pt) { return this.sub(pt).squaredMag() }
	dist(pt) { return this.sub(pt).mag() }

	manhattanMag() { return Math.abs(this.x) + Math.abs(this.y) + (this.is3D ? Math.abs(this.z) : 0) }
	manhattanDist(pt) { return Math.abs(this.x - pt.x) + Math.abs(this.y - pt.y) + (this.is3D ? Math.abs(this.z - pt.z) : 0) }
	
	dot(pt) { return this.x * pt.x + this.y * pt.y + (this.is3D ? this.z * pt.z : 0) }

	*lineTo(that, halfOpen = false) {
		if (this.is3D != that.is3D) {
			throw `Point.lineTo: Tried to make line between 2D point and 3D point: ${this.toString}; ${that.toString}`
		}

		if (this.equals(that)) {
			yield this.copy()
			return
		}

		let dir = new Point(
			Math.sign(that.x - this.x),
			Math.sign(that.y - this.y),
			this.is3D ? Math.sign(that.z - this.z) : undefined)

		if (!that.sub(this).normMut().equals(dir)) {
			throw `Point.lineTo: Line not straight: ${this.toString()}; ${that.toString()}`
		}

		let pt = this.copy()

		while (!that.equals(pt)) {
			yield pt
			pt = pt.add(dir)
		}

		if (!halfOpen) {
			yield pt
		}
	}

	readingOrderCompare(pt) {
		if (this.is3D && this.z < pt.z) {
			return -1
		} else if (this.is3D && this.z > pt.z) {
			return 1
		} else if (this.y < pt.y) {
			return -1
		} else if (this.y > pt.y) {
			return 1
		} else if (this.x < pt.x) {
			return -1
		} else if (this.x > pt.x) {
			return 1
		} else {
			return 0
		}
	}

	copy() { return new Point(this.x, this.y, this.z) }
	toString() { return this.x + "," + this.y + (this.is3D ? "," + this.z : "") }
	
	static fromString(str) {
		let [x, y, z] = str.split(",")
		return new Point(+x, +y, z && +z)
	}
	
	setFromString(str) {
		let [x, y, z] = str.split(",")
		
		this.is3D = z != undefined
		this.x = +x
		this.y = +y
		this.z = +z
		
		return this
	}

	[Symbol.toPrimitive]() {
		if (Point.STRING) {
			return this.toString()
		} else {
			return Point.encode(this)
		}
	}
}

Point.NONE = new Point(null, null)

Point.ZERO = new Point(0, 0)
Point.ORIGIN = Point.ZERO

Point.NORTH = Point.UP = Point.ZERO.up()
Point.WEST = Point.LEFT = Point.ZERO.left()
Point.SOUTH = Point.DOWN = Point.ZERO.down()
Point.EAST = Point.RIGHT = Point.ZERO.right()

Point.UP.ccwConst = Point.LEFT
Point.UP.cwConst = Point.RIGHT
Point.UP.negConst = Point.DOWN

Point.LEFT.ccwConst = Point.DOWN
Point.LEFT.cwConst = Point.UP
Point.LEFT.negConst = Point.RIGHT

Point.DOWN.ccwConst = Point.RIGHT
Point.DOWN.cwConst = Point.LEFT
Point.DOWN.negConst = Point.UP

Point.RIGHT.ccwConst = Point.UP
Point.RIGHT.cwConst = Point.DOWN
Point.RIGHT.negConst = Point.LEFT

Point.DIRS = [Point.UP, Point.LEFT, Point.DOWN, Point.RIGHT]

P = function P(...args) {
	return new Point(...args)
}


