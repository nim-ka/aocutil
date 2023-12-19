Grid = class Grid {
	constructor(w, h, fill = 0) {
		this.width = w
		this.height = h
		this.data = utils.createGridArray(w, h, fill)
	}

	get w() { return this.width }
	set w(val) { this.width = val }
	get h() { return this.height }
	set h(val) { this.height = val }

	forEach(func) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				func(this.get(pt), pt, this)
			}
		}
		
		return this
	}

	map(func) { return new Grid(this.width, this.height).mapMut((e, pt) => func(this.get(pt), pt, this)) }
	
	mapMut(func) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				this.set(pt, func(this.get(pt), pt.copy(), this))
			}
		}
		
		return this
	}

	fill(n) { return this.mapMut(() => n) }

	fillFromArr(arr) {
		if (arr.length != this.height) {
			throw `Grid.fillFromArr: Column size ${arr.length} does not match grid height ${this.height}`
		}
		
		
		for (let y = 0; y < this.height; y++) {
			if (arr[y].length != this.width) {
				throw `Grid.fillFromArr: Row ${y} has size ${arr[y].length} instead of grid width ${this.width}`
			}
			
			for (let x = 0; x < this.width; x++) {
				this.data[y][x] = arr[y][x]
			}
		}

		return this
	}

	fillFromStr(str, sep = "") { return this.fillFromArr(str.split("\n").map((line) => line.split(sep))) }

	static fromArr(arr) { return new Grid(arr[0].length, arr.length).fillFromArr(arr) }
	static fromStr(str, sep = "") { return Grid.fromArr(str.split("\n").map((line) => line.split(sep))) }

	static fromObj(obj, fill = null, translate = false) {
		let entries = Object.keys(obj).map((e) => [Point.decode2D(e), obj[e]]).filter((e) => e[0])

		let minX = entries.minVal((e) => e[0].x)
		let maxX = entries.maxVal((e) => e[0].x)
		let minY = entries.minVal((e) => e[0].y)
		let maxY = entries.maxVal((e) => e[0].y)

		if ((minX < 0 || minY < 0) && !translate) {
			console.warn("Grid.fromObj: Object has negative point indices, but translation not specified. Translating anyway")
			translate = true
		}

		let translation = translate ? new Point(-minX, -minY) : new Point(0, 0)

		let grid = new Grid(
			translate ? maxX - minX + 1 : maxX + 1,
			translate ? maxY - minY + 1 : maxY + 1,
			fill)

		for (let [point, value] of entries) {
			grid.set(point.add(translation), value)
		}

		return grid
	}

	wrap(pt) {
		let x = ((pt.x % this.width) + this.width) % this.width
		let y = ((pt.y % this.height) + this.height) % this.height
		return new Point(x, y)
	}

	get(pt) {
		if (this.contains(pt)) {
			return this.data[pt.y][pt.x]
		} else {
			console.error("Grid.get: Grid does not contain point " + pt.toString() + ":\n" + this.toString().slice(0, 300))
			throw [this.width, this.height]
		}
	}

	getDef(pt, def) {
		if (this.contains(pt)) {
			return this.data[pt.y][pt.x]
		} else {
			return def
		}
	}

	getWrap(pt) {
		return this.get(this.wrap(pt))
	}

	set(pt, val) {
		if (this.contains(pt)) {
			this.data[pt.y][pt.x] = val
			return this
		} else {
			console.error("Grid.set: does not contain point " + pt.toString() + ":\n" + this.toString().slice(0, 300))
			throw [this.width, this.height]
		}
	}

	setWrap(pt, val) {
		return this.set(this.wrap(pt), val)
	}

	getColumn(x) {
		if (x >= 0 && x < this.width) {
			return this.data.map((row) => row[x])
		} else {
			console.error("Grid.getColumn: does not contain column " + x.toString() + ":\n" + this.toString().slice(0, 300))
			throw [this.width, this.height]
		}
	}

	getRow(y) {
		if (y >= 0 && y < this.height) {
			return this.data[y]
		} else {
			console.error("Grid.getRow: does not contain row " + y.toString() + ":\n" + this.toString().slice(0, 300))
			throw [this.width, this.height]
		}
	}

	getSection(pt1, pt2) {
		if (pt2.x >= pt1.x && pt2.y >= pt2.y) {
			return new Grid(pt2.x - pt1.x + 1, pt2.y - pt1.y + 1).mapMut((_, pt) => this.get(pt.add(pt1)))
		} else {
			console.error("Grid.getSection: Second point " + pt2.toString() + " behind first point " + pt1.toString() + ":\n" + this.toString().slice(0, 300))
			throw [this.width, this.height]
		}
	}

	getRows() {
		return this.data.copy()
	}

	getColumns() {
		return this.data.transpose()
	}
	
	expand(n, fill = this.get(new Point(0, 0))) {
		return new Grid(this.width + n * 2, this.height + n * 2).mapMut((e, pt) => this.getDef(new Point(pt.x - n, pt.y - n), fill))
	}

	findIndex(el) {
		let func = functify(el)

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				if (func(this.get(pt), pt, this)) {
					return pt
				}
			}
		}

		return Point.NONE
	}

	find(el) {
		return this.get(this.findIndex(el))
	}

	findIndices(el) {
		let func = functify(el)
		let points = new PointArray()
		
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				if (func(this.get(pt), pt, this)) {
					points.push(pt)
				}
			}
		}

		return points
	}

	findAll(func) {
		let vals = new PointArray()
		
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				let val = this.get(pt)
				if (func(val, pt, this)) {
					vals.push(val)
				}
			}
		}

		return vals
	}
	
	findAllIndices(el) {
		return this.findIndices(el)
	}

	filter(func) {
		return this.findAll(func)
	}

	count(func) {
		return this.findIndices(func).length
	}

	indexOf(val) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pt = new Point(x, y)
				if (this.get(pt) == val) {
					return pt
				}
			}
		}

		return Point.NONE
	}

	includes(val) {
		return this.indexOf(val) != Point.NONE
	}

	some(el) {
		return this.findIndex(el) != Point.NONE
	}

	every(el) {
		let func = functify(el)
		return this.findIndex((e) => !func(e)) == Point.NONE
	}

	no(el) {
		return !this.some(el)
	}

	contains(pt) { return !pt.is3D && pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height }
	
	topleft() { return new Point(0, 0) }
	topright() { return new Point(this.width - 1, 0) }
	bottomleft() { return new Point(0, this.height - 1) }
	bottomright() { return new Point(this.width - 1, this.height - 1) }
	
	tl() { return new Point(0, 0) }
	tr() { return new Point(this.width - 1, 0) }
	bl() { return new Point(0, this.height - 1) }
	br() { return new Point(this.width - 1, this.height - 1) }

	getAdjNeighbors(pt) { return pt.getUnfilteredAdjNeighbors().filter((pt) => this.contains(pt)) }
	getAdjNeighborsIncSelf(pt) { return pt.getUnfilteredAdjNeighborsIncSelf().filter((pt) => this.contains(pt)) }
	getDiagNeighbors(pt) { return pt.getUnfilteredDiagNeighbors().filter((pt) => this.contains(pt)) }
	getDiagNeighborsIncSelf(pt) { return pt.getUnfilteredDiagNeighborsIncSelf().filter((pt) => this.contains(pt)) }
	getAllNeighbors(pt) { return pt.getUnfilteredAllNeighbors().filter((pt) => this.contains(pt)) }
	getAllNeighborsIncSelf(pt) { return pt.getUnfilteredAllNeighborsIncSelf().filter((pt) => this.contains(pt)) }

	getAdjNeighborsThat(pt, func) { return pt.getUnfilteredAdjNeighbors().filter((pt) => this.contains(pt) && func(pt)) }
	getAdjNeighborsIncSelfThat(pt, func) { return pt.getUnfilteredAdjNeighborsIncSelf().filter((pt) => this.contains(pt) && func(pt)) }
	getDiagNeighborsThat(pt, func) { return pt.getUnfilteredDiagNeighbors().filter((pt) => this.contains(pt) && func(pt)) }
	getDiagNeighborsIncSelfThat(pt, func) { return pt.getUnfilteredDiagNeighborsIncSelf().filter((pt) => this.contains(pt) && func(pt)) }
	getAllNeighborsThat(pt, func) { return pt.getUnfilteredAllNeighbors().filter((pt) => this.contains(pt) && func(pt)) }
	getAllNeighborsIncSelfThat(pt, func) { return pt.getUnfilteredAllNeighborsIncSelf().filter((pt) => this.contains(pt) && func(pt)) }

	getAdjNeighborsWrap(pt) { return pt.getUnfilteredAdjNeighbors().map((pt) => this.wrap(pt)) }
	getAdjNeighborsWrapIncSelf(pt) { return pt.getUnfilteredAdjNeighborsIncSelf().map((pt) => this.wrap(pt)) }
	getDiagNeighborsWrap(pt) { return pt.getUnfilteredDiagNeighbors().map((pt) => this.wrap(pt)) }
	getDiagNeighborsWrapIncSelf(pt) { return pt.getUnfilteredDiagNeighborsIncSelf().map((pt) => this.wrap(pt)) }
	getAllNeighborsWrap(pt) { return pt.getUnfilteredAllNeighbors().map((pt) => this.wrap(pt)) }
	getAllNeighborsWrapIncSelf(pt) { return pt.getUnfilteredAllNeighborsIncSelf().map((pt) => this.wrap(pt)) }

	getAdjNeighborsWrapThat(pt, func) { return pt.getUnfilteredAdjNeighbors().map((pt) => this.wrap(pt)).filter(func) }
	getAdjNeighborsWrapIncSelfThat(pt, func) { return pt.getUnfilteredAdjNeighborsIncSelf().map((pt) => this.wrap(pt)).filter(func) }
	getDiagNeighborsWrapThat(pt, func) { return pt.getUnfilteredDiagNeighbors().map((pt) => this.wrap(pt)).filter(func) }
	getDiagNeighborsWrapIncSelfThat(pt, func) { return pt.getUnfilteredDiagNeighborsIncSelf().map((pt) => this.wrap(pt)).filter(func) }
	getAllNeighborsWrapThat(pt, func) { return pt.getUnfilteredAllNeighbors().map((pt) => this.wrap(pt)).filter(func) }
	getAllNeighborsWrapIncSelfThat(pt, func) { return pt.getUnfilteredAllNeighborsIncSelf().map((pt) => this.wrap(pt)).filter(func) }

	static BFS_CONTINUE = 0
	static BFS_STOP = 1
	static BFS_END = 2
	
	static CONT = Grid.BFS_CONTINUE
	static STOP = Grid.BFS_STOP
	static END = Grid.BFS_END
	
	bfs(pt, func, neighbors = "getAdjNeighbors", limit = 1000) {
		let toVisit = new BinHeap((a, b) => a.dist < b.dist || a.dist == b.dist && a.readingOrderCompare(b) < 0)
		
		let visited = new Set()
		let count = 0
		let end
		
		let start = pt.copy()
		start.dist = 0
		start.last = null
		toVisit.insert(start)
		
		out: while (toVisit.data.length > 0 && count++ < limit) {
			let pt = toVisit.extract()
			let res = func(this.get(pt), pt, this, visited)
			
			if (res == Grid.BFS_END) {
				return pt
			}
			
			if (res == Grid.BFS_CONTINUE) {
				for (let neighbor of this[neighbors](pt).filter((pt) => !visited.has(pt.toString()))) {
					neighbor.dist = pt.dist + 1
					neighbor.last = pt
					toVisit.insert(neighbor)
				}
			}
			
			visited.add(pt.toString())
		}

		if (count >= limit) {
			console.warn("Limit reached. Aborted.")
		}

		return visited
	}
	
	floodfill(pt, oldVal, newVal, neighbors, limit) {
		this.bfs(pt, (e, pt) => e == oldVal ? (this.set(pt, newVal), Grid.BFS_CONTINUE) : Grid.BFS_STOP, neighbors, limit)
		return this
	}
	
	floodfillExc(pt, newVal, neighbors, limit) {
		this.bfs(pt, (e, pt) => e != newVal ? (this.set(pt, newVal), Grid.BFS_CONTINUE) : Grid.BFS_STOP, neighbors, limit)
		return this
	}

	transpose() {
		this.data = this.data.transpose()
		this.width = this.data[0].length
		this.height = this.data.length
		return this
	}

	reflectX() {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i].reverse()
		}
		
		return this
	}

	reflectY() {
		this.data.reverse()
		return this
	}

	rotate90() { return this.transpose().reflectX() }
	rotate180() { return this.reflectX().reflectY() }
	rotate270() { return this.reflectX().transpose() }

	rotate(n) {
		for (let i = 0; i < Math.abs(n); i++) {
			this[n > 0 ? "rotate90" : "rotate270"]()
		}

		return this
	}

	allTransformations() {
		return [
			this.copy(),
			this.copy().rotate90(),
			this.copy().rotate180(),
			this.copy().rotate270(),
			this.copy().reflectX(),
			this.copy().reflectX().transpose().reflectX(),
			this.copy().reflectY(),
			this.copy().transpose()
		]
	}

	graphify(neighbors = "getAdjNeighbors", cxn = (node, cxnNode) => node.addCxn(cxnNode, cxnNode.val)) {
		this.mapMut((e) => new Node(e))
		this.forEach((e, pt) => this[neighbors](pt).forEach((pt) => cxn(e, this.get(pt))))
		return this
	}

	copy() { return this.map((e) => e) }
	
	toString(sep = "", pts = undefined, ptkey = "#") {
		let str = ""
		
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (pts && new Point(x, y).isIn(pts)) {
					str += ptkey
				} else {
					str += this.data[y][x]
				}
				
				if (x < this.width - 1) {
					str += sep
				}
			}
			
			if (y < this.height - 1) {
				str += "\n"
			}
		}
		
		return str
	}
	
	print(sep, pts, ptkey) { console.log(this.toString(sep, pts, ptkey)) }
}

G = function G(...args) {
	if (typeof args[0] == "string") {
		return Grid.fromStr(...args)
	}

	return new Grid(...args)
}

