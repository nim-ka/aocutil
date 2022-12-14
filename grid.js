Grid = class Grid {
	constructor(w, h, fill = 0) {
		this.width = w
		this.height = h
		this.data = utils.createGridArray(w, h, fill)
	}

	forEach(func) {
		this.data.map((r, y) => r.map((e, x) => func(e, new Point(x, y), this)))
		return this
	}

	map(func) { return new Grid(this.width, this.height).mapMut((e, pt) => func(this.get(pt), pt, this)) }
	mapMut(func) { return this.forEach((e, pt, grid) => grid.set(pt, func(e, pt, grid))) }

	fill(n) { return this.mapMut(() => n) }

	fillFromArr(arr) {
		if (arr[0].length != this.width) {
			console.warn(`Grid.fillFromArr: Row size ${arr[0].length} does not match grid width ${this.width}`)
		}

		if (arr.length != this.height) {
			console.warn(`Grid.fillFromArr: Column size ${arr.length} does not match grid height ${this.height}`)
		}

		return this.mapMut((_, pt) => arr[pt.y][pt.x])
	}

	fillFromStr(str, sep = "") { return this.fillFromArr(str.split("\n").map((line) => line.split(sep))) }

	static fromArr(arr) { return new Grid(arr[0].length, arr.length).fillFromArr(arr) }
	static fromStr(str, sep = "") { return Grid.fromArr(str.split("\n").map((line) => line.split(sep))) }

	static fromObj(obj, fill = null, translate = false) {
		let entries = Object.keys(obj).map((e) => [Point.decode2D(e), obj[e]])

		let minX = entries.minVal((e) => e[0].x)
		let maxX = entries.maxVal((e) => e[0].x)
		let minY = entries.minVal((e) => e[0].y)
		let maxY = entries.maxVal((e) => e[0].y)

		if (minX < 0 || minY < 0) {
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

	get(pt) {
		if (this.contains(pt)) {
			return this.data[pt.y][pt.x]
		} else {
			console.error("Grid.get: Grid does not contain point " + pt.toString() + ":\n" + this.toString())
		}
	}

	set(pt, val) {
		if (this.contains(pt)) {
			this.data[pt.y][pt.x] = val
			return this
		} else {
			console.error("Grid.set: does not contain point " + pt.toString() + ":\n" + this.toString())
		}
	}

	getColumn(x) {
		if (x >= 0 && x < this.width) {
			return this.data.map((row) => row[x])
		} else {
			console.error("Grid.getColumn: does not contain column " + x.toString() + ":\n" + this.toString())
		}
	}

	getRow(y) {
		if (y >= 0 && y < this.height) {
			return this.data[y]
		} else {
			console.error("Grid.getRow: does not contain row " + y.toString() + ":\n" + this.toString())
		}
	}

	getSection(pt1, pt2) {
		if (pt2.x >= pt1.x && pt2.y >= pt2.y) {
			return new Grid(pt2.x - pt1.x + 1, pt2.y - pt1.y + 1).mapMut((_, pt) => this.get(pt.add(pt1)))
		} else {
			console.error("Grid.getSection: Second point " + pt2.toString() + " behind first point " + pt1.toString() + ":\n" + this.toString())
		}
	}

	getRows() {
		return this.data.copy()
	}

	getColumns() {
		return this.data.transpose()
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

	find(func) {
		return this.get(this.findIndex(func))
	}

	findIndices(el) {
		let func = functify(el)

		let points = new PointArray()
		this.forEach((e, pt, grid) => func(e, pt, grid) ? points.push(pt) : 0)

		return points
	}

	findAll(func) {
		return this.findIndices(func).mapArr((pt) => this.get(pt))
	}

	filter(func) {
		return this.findAll(func)
	}

	count(func) {
		return this.findIndices(func).length
	}

	indexOf(val) {
		return this.findIndex((e) => e == val)
	}

	contains(pt) { return !pt.is3D && pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height }

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

	static BFS_CONTINUE = 0
	static BFS_STOP = 1
	static BFS_END = 2

	bfs(pt, func, neighbors = "getAdjNeighborsThat", limit = 1000) {
		let visited = new PointArray()
		let toVisit = new PointArray(pt)
		let count = 0
		let end

		toVisit[0].path = new PointArray(pt)

		out: while (toVisit.length > 0 && count++ < limit) {
			let newToVisit = new PointArray()

			toVisit.sort()

			for (let i = 0; i < toVisit.length; i++) {
				let v = toVisit[i]

				v.result = func(this.get(v), v, this, visited)

				if (v.result == Grid.BFS_CONTINUE) {
					newToVisit.pushUniq(...this[neighbors](v, (pt) => !pt.isIn(visited)).map((pt) => (pt.path = [...v.path, pt], pt)))
				}

				if (v.result == Grid.BFS_END) {
					end = v
					break out
				}
			}

			visited.pushUniq(...toVisit)
			toVisit = newToVisit
		}

		if (count >= limit) {
			console.warn("Limit reached. Aborted.")
		}

		return end || visited
	}

	transpose() {
		this.data = this.data.transpose()
		this.width = this.data[0].length
		this.height = this.data.length
		return this
	}

	reflectX() {
		this.data = this.data.map((row) => row.reverse())
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
	toString(sep = "", pts = [], ptkey = "P") { return this.data.map((r, y) => r.map((e, x) => new Point(x, y).isIn(pts) ? ptkey : e).join(sep)).join("\n") }
	print(sep, pts, ptkey) { console.log(this.toString(sep, pts, ptkey)) }
}

