// TODO:
// - copy method
// - remove range method

DLLNode = class DLLNode {
	constructor(val, skip = this, prev = this, next = this) {
		this.val = val
		this.skip = skip
		this.prev = prev
		this.next = next
	}

	adv(n = 1) {
		let node = this == this.skip ? this.next : this

		if (n < 0) {
			while (n++) {
				node = node.prev
				if (node == this.skip) node = node.prev
			}
		} else {
			while (n--) {
				node = node.next
				if (node == this.skip) node = node.next
			}
		}

		return node
	}
}

DLL = class DLL {
	constructor(a = []) {
		this.h = new DLLNode()
		this.length = 0;

		a.forEach((e, i, a) => this.insEnd(e))
	}

	insNodeAheadNode(old, node) {
		node.next = old.next
		old.next.prev = node
		old.next = node
		node.prev = old
		return ++this.length
	}

	insDLLAheadNode(old, dll) {
		let start = dll.getNode(0)
		let end = dll.getNode(-1)
		end.next = old.next
		old.next.prev = end
		old.next = start
		start.prev = old
		return this.length += dll.length
	}

	insAheadNode(old, val) {
		let node = new DLLNode(val, this.h, old, old.next)
		old.next = node
		old.next.next.prev = node
		return ++this.length
	}

	insStart(val) { return this.insAheadNode(this.h, val) }
	unshift(val) { return this.insStart(val) }

	insNodeBehindNode(old, node) {
		node.prev = old.prev
		old.prev.next = node
		old.prev = node
		node.next = old
		return ++this.length
	}

	insDLLBehindNode(old, dll) {
		let start = dll.getNode(0)
		let end = dll.getNode(-1)
		start.prev = old.prev
		old.prev.next = start
		old.prev = end
		end.next = old
		return this.length += dll.length
	}

	insBehindNode(old, val) {
		let node = new DLLNode(val, this.h, old.prev, old)
		old.prev = node
		old.prev.prev.next = node
		return ++this.length
	}

	insEnd(val) { return this.insBehindNode(this.h, val) }

	push(...vals) {
		let ret
		vals.forEach((val) => ret = this.insEnd(val))
		return ret
	}

	insNode(idx, node) { return this.insNodeBehindNode(this.getNode(idx), node) }
	insDLL(idx, dll) { return this.insDLLBehindNode(this.getNode(idx), dll) }
	ins(idx, val) { return this.insBehindNode(this.getNode(idx), val) }
	insNodeAhead(idx, node) { return this.insNodeAheadNode(this.getNode(idx), node) }
	insDLLAhead(idx, dll) { return this.insDLLAheadNode(this.getNode(idx), dll) }
	insAhead(idx, val) { return this.insAheadNode(this.getNode(idx), val) }

	removeNode(node) {
		let tmp = node.next
		node.prev.next = node.next
		tmp.prev = node.prev
		this.length--
		return node
	}

	remove(idx) { return this.removeNode(this.getNode(idx)).val }

	getNode(idx) { return this.h.adv(idx) }
	get(idx) { return this.getNode(idx).val }

	reverse() {
		let node = this.h

		do {
			let next = node.next
			let tmp = node.prev
			node.prev = node.next
			node.next = tmp
			node = next
		} while (node != this.h)

		return this
	}

	rotate(rot) {
		let tmp = this.h.next
		this.removeNode(this.h)
		this.insBehindNodeNode(tmp.adv(-rot), this.h)
	}

	forEachNode(f) {
		let i = 0, node = this.h.next;

		while (node != this.h) {
			f(node, i++)
			node = node.next
		}

		return this
	}

	forEach(f) { return this.forEachNode((node, idx) => f(node.val, idx)) }
	mapMut(f) { return this.forEachNode((node, idx) => node.val = f(node.val, idx)) }

	includes(val) {
		let res = false
		this.forEach((e) => res |= e == val)
		return res
	}

	toArray() {
		let arr = new Array(this.length)

		this.forEach((el, idx) => arr[idx] = el)

		return arr
	}

	toJSON() { return this.toArray() }
	toString() { return this.toArray().toString() }
}

Pt = Point = class Point {
	constructor(x, y, z) {
		this.is3D = z != undefined
		this.x = x
		this.y = y
		this.z = z
	}

	equals(pt) { return this.x == pt.x && this.y == pt.y && (!this.is3D || this.z == pt.z) }

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
	above() { return new Point(this.x, this.y, this.z - 1) }
	below() { return new Point(this.x, this.y, this.z + 1) }

	u() { return this.up() }
	d() { return this.down() }
	l() { return this.left() }
	r() { return this.right() }
	ul() { return this.upleft() }
	ur() { return this.upright() }
	dl() { return this.downleft() }
	dr() { return this.downright() }

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
			console.error("Can't get wing neighbors of 2D point")
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

	squaredDist(pt) { return this.sub(pt).squaredMag() }
	dist(pt) { return this.sub(pt).mag() }

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
}

Point.NONE = new Point(null, null)

P = function P(...args) {
	return new Point(...args)
}


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

	get(pt) {
		if (this.contains(pt)) {
			return this.data[pt.y][pt.x]
		} else {
			console.error("Grid.get: Grid does not contain point " + pt + ":\n" + this)
		}
	}

	set(pt, val) {
		if (this.contains(pt)) {
			this.data[pt.y][pt.x] = val
		} else {
			console.error("Grid.set: does not contain point " + pt + ":\n" + this)
		}
	}

	getColumn(x) {
		if (x >= 0 && x < this.width) {
			return this.data.map((row) => row[x])
		} else {
			console.error("Grid.getColumn: does not contain column " + x + ":\n" + this)
		}
	}

	getRow(y) {
		if (y >= 0 && y < this.height) {
			return this.data[y]
		} else {
			console.error("Grid.getRow: does not contain row " + y + ":\n" + this)
		}
	}

	getSection(pt1, pt2) {
		if (pt2.x >= pt1.x && pt2.y >= pt2.y) {
			return new Grid(pt2.x - pt1.x + 1, pt2.y - pt1.y + 1).mapMut((_, pt) => this.get(pt.add(pt1)))
		} else {
			console.error("Grid.getSection: Second point " + pt2 + " behind first point " + pt1 + ":\n" + this)
		}
	}

	getRows() {
		return this.data.copy()
	}

	getColumns() {
		return this.data.transpose()
	}

	findIndex(func) {
		func = typeof func == "function" ? func : (e) => e == func

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

	findAllIndices(func) {
		func = typeof func == "function" ? func : (e) => e == func

		let points = new PointArray()
		this.forEach((e, pt, grid) => func(e, pt, grid) ? points.push(pt) : 0)

		return points
	}

	findAll(func) {
		return this.findAllIndices(func).mapArr((pt) => this.get(pt))
	}

	count(func) {
		return this.findAllIndices(func).length
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
		return
	}

	copy() { return new Grid(this.width, this.height).mapMut((_, pt) => this.get(pt).copyDeep()) }
	toString(sep = "\t", ...pts) { return this.data.map((r, y) => r.map((e, x) => new Point(x, y).isIn(pts) ? "P" : e).join(sep)).join("\n") }
	print(sep = "\t", ...pts) { console.log(this.toString(sep, pts)) }
}

BinHeap = class BinHeap {
	constructor(cond = (p, c) => p < c) {
		this.cond = cond
		this.data = []
	}

	getTop() { return this.data[0] }
	getParent(idx) { return idx / 2 | 0 }
	getChildLeft(idx) { return 2 * idx }
	getChildRight(idx) { return 2 * idx + 1 }

	insert(val) {
		this.up(this.data.push(val) - 1)
	}

	extract() {
		let res = this.data[0]

		if (this.data.length > 1) {
			this.data[0] = this.data.pop()
			this.down(0)
		} else {
			this.data = []
		}

		return res
	}

	up(idx) {
		while (this.getParent(idx) != idx && !this.cond(this.data[this.getParent(idx)], this.data[idx])) {
			let tmp = this.data[this.getParent(idx)]
			this.data[this.getParent(idx)] = this.data[idx]
			this.data[idx] = tmp
			idx = this.getParent(idx)
		}
	}

	down(idx) {
		let largest = idx
		let left = this.getChildLeft(idx)
		let right = this.getChildRight(idx)

		if (left < this.data.length && this.cond(this.data[left], this.data[largest])) {
			largest = left
		}

		if (right < this.data.length && this.cond(this.data[right], this.data[largest])) {
			largest = right
		}

		if (largest != idx) {
			let tmp = this.data[largest]
			this.data[largest] = this.data[idx]
			this.data[idx] = tmp

			this.down(largest)
		}
	}
}

Cxn = class Cxn {
	constructor(dest, weight = 1) {
		this.dest = dest
		this.weight = weight
	}
}

SearchData = class SearchData {
	constructor(id, dist = Infinity, last = undefined, custom = {}) {
		this.id = id
		this.dist = dist
		this.last = last
		this.custom = custom
	}

	get(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
		}

		return { dist: this.dist, last: this.last, custom: this.custom }
	}

	update(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id || this.dist > dist) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
			return true
		}

		return false
	}
}

Node = class Node {
	static GLOBAL_ID = 0

	constructor(val) {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.cxns = []
		this.searchData = new SearchData(0)
	}

	addCxn(node, weight = 1) { this.cxns.push(new Cxn(node, weight)) }
	mapCxnsMut(func) { this.cxns = this.cxns.map(func) }
	filterCxnsMut(func) { this.cxns = this.cxns.filter(func) }
	getWeightTo(node) { return this.cxns.find((cxn) => cxn.dest == node)?.weight }

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}

	dijkstraTo(dests) {
		if (!Array.isArray(dests)) {
			dests = [dests]
		}

		let id = Symbol()

		this.searchData.update(id, 0)

		console.time("heap gen")

		let heap = new BinHeap((p, c) => p.searchData.get(id, Infinity, undefined, true).dist < c.searchData.get(id, Infinity, undefined, true).dist)
		let visited = {}
		let toVisit = [this]

		while (toVisit.length) {
			let toVisitNew = []

			toVisit.forEach((node) => {
				heap.insert(node)
				visited[node.id] = true
				node.cxns.map((cxn) => cxn.dest).map((node) => {
					if (!visited[node.id]) {
						toVisitNew.push(node)
						visited[node.id] = true
					}
				})
			})

			toVisit = toVisitNew
			console.log(toVisit.length)
		}

		console.timeEnd("heap gen")
		console.time("search")

		let i = 0

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id, Infinity, undefined, true).dist
			min.searchData.custom = false

			if (dests.includes(min)) {
				console.timeEnd("search")
				min.searchData.get(id)
				return min
			}

			min.cxns.filter((cxn) => cxn.dest.searchData.get(id).custom).forEach((cxn) => {
				if (cxn.dest.searchData.update(id, minDist + cxn.weight, min, true)) {
					let idx = heap.data.indexOf(cxn.dest)
					if (idx > -1) {
						heap.up(idx)
					}
				}
			})

			if (++i % 1000 == 0) {
				console.log(heap.data.length)
			}
		}

		console.timeEnd("search")
		console.warn("Node.dijkstraTo: Could not find a path")
	}
}

PtArray = PointArray = class PointArray extends Array {
	static convert(arr) {
		if (!(arr instanceof PointArray)) {
			arr.__proto__ = PointArray.prototype
		}

		return arr
	}

	static revert(arr) {
		if (arr.__proto__ != Array.prototype) {
			arr.__proto__ = Array.prototype
		}

		return arr
	}
}

let warned = false

load = function load() {
	Object.defineProperties(Object.prototype, {
		copyDeep: {
			value: function() {
				return JSON.parse(JSON.stringify(this))
			},
			configurable: true
		},
		num: {
			value: function() {
				if (this.map) {
					return this.map((e) => +e)
				} else if (this.mapMut) {
					return this.mapMut((e) => +e)
				} else {
					console.error("Object.prototype.num: No suitable map method found")
				}
			},
			configurable: true
		}
	})

	Object.defineProperties(Array.prototype, {
		pt: {
			get: function() {
				return PointArray.convert(this)
			},
			configurable: true
		},
		last: {
			get: function() {
				return this[this.length - 1]
			},
			set: function(val) {
				this[this.length - 1] = val
			},
			configurable: true
		},
		dll: {
			value: function() {
				return new DLL(this)
			},
			configurable: true
		},
		truthy: {
			value: function() {
				return this.filter((e) => e)
			},
			configurable: true
		},
		splitOnElement: {
			value: function(sep) {
				let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (this[i] == sep) {
						arr.push([])
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
			},
			configurable: true
		},
		copy: {
			value: function() {
				return this.slice()
			},
			configurable: true
		},
		copyDeep: {
			value: function() {
				return JSON.parse(JSON.stringify(this))
			},
			configurable: true
		},
		mapArr: {
			value: function(fn) {
				const mapped = new Array(this.length)

				for (let i = 0; i < this.length; i++) {
					mapped[i] = fn(this[i], i, this)
				}

				return mapped
			},
			configurable: true
		},
		sum: {
			value: function(val = 0) {
				return this.reduce((a, b) => a + b, val)
			},
			configurable: true
		},
		prod: {
			value: function(val = 1) {
				return this.reduce((a, b) => a * b, val)
			},
			configurable: true
		},
		cartProduct: {
			value: function(that) {
				return this.flatMap((e) => that.map((f) => [e, f]))
			},
			configurable: true
		},
		flatDeep: {
			value: function() {
				return this.flat(Infinity)
			},
			configurable: true
		},
		transpose: {
			value: function() {
				return this[0].map((_, i) => this.map(e => e[i]))
			},
			configurable: true
		},
		findLast: {
			value: function(func) {
				for (let i = this.length - 1; i >= 0; i--) {
					if (func(this[i], i, this)) {
						return this[i]
					}
				}
			},
			configurable: true
		},
		findLastIndex: {
			value: function(func) {
				for (let i = this.length - 1; i >= 0; i--) {
					if (func(this[i], i, this)) {
						return i
					}
				}

				return -1
			},
			configurable: true
		},
		interleave: {
			value: function(that) {
				return [this, that].transpose().flat()
			},
			configurable: true
		},
		rotateLeft: {
			value: function(n) {
				let k = (this.length + n) % this.length
				return [...this.slice(k), ...this.slice(0, k)]
			},
			configurable: true
		},
		sub: {
			value: function(that) {
				return this.filter(e => !that.includes(e))
			},
			configurable: true
		},
		int: {
			value: function(that) {
				return this.filter(e => that.includes(e))
			},
			configurable: true
		},
		uniq: {
			value: function() {
				return this.filter((e, i) => this.indexOf(e) == i)
			},
			configurable: true
		},
		pushUniq: {
			value: function(...vals) {
				if (!warned) {
					console.warn("You should probably use a Set")
					warned = true
				}

				return this.push(...vals.uniq().sub(this))
			},
			configurable: true
		},
		count: {
			value: function(fn) {
				return this.filter(typeof fn == "function" ? fn : (e) => e == fn).length
			},
			configurable: true
		},
		minIndex: {
			value: function(fn = (e) => e, tiebreak) {
				let minval = Infinity
				let min
				let idx

				for (let i = 0; i < this.length; i++) {
					let val = fn(this[i])

					if (minval > val ||
						(minval == val && tiebreak && tiebreak(min, this[i], idx, i) > 0)) {
						minval = val
						min = this[i]
						idx = i
					}
				}

				return idx
			},
			configurable: true
		},
		min: {
			value: function(fn, tiebreak) {
				return this[this.minIndex(fn, tiebreak)]
			},
			configurable: true
		},
		maxIndex: {
			value: function(fn = (e) => e, tiebreak) {
				let maxval = -Infinity
				let max
				let idx

				for (let i = 0; i < this.length; i++) {
					let val = fn(this[i])

					if (maxval < val ||
						(maxval == val && tiebreak && tiebreak(max, this[i], idx, i) > 0)) {
						maxval = val
						max = this[i]
						idx = i
					}
				}

				return idx
			},
			configurable: true
		},
		max: {
			value: function(fn, tiebreak) {
				return this[this.maxIndex(fn, tiebreak)]
			},
			configurable: true
		},
		mean: {
			value: function() {
				return this.sum() / this.length
			},
			configurable: true
		},
		medianNumeric: {
			value: function() {
				let sorted = this.copy().sort((a, b) => a - b)

				if (sorted.length % 2) {
					return sorted[(sorted.length - 1) / 2]
				} else {
					return (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
				}
			},
		},
		freqs: {
			value: function() {
				return this.uniq().map((e) => [e, this.count(e)])
			},
			configurable: true
		},
		mode: {
			value: function(tiebreak) {
				return this.freqs().max((e) => e[1], (a, b, ai, bi) => tiebreak(a[0], b[0]))[0]
			},
			configurable: true
		},
		antimode: {
			value: function(tiebreak) {
				return this.freqs().min((e) => e[1], (a, b, ai, bi) => tiebreak(a[0], b[0]))[0]
			},
			configurable: true
		}
	})

	Object.defineProperties(PointArray.prototype, {
		arr: {
			get: function() {
				return PointArray.revert(this)
			},
			configurable: true
		},
		splitOnElement: {
			value: function(sep) {
				let arr = [new PointArray()]

				for (let i = 0; i < this.length; i++) {
					if (this[i].equals(sep)) {
						arr.push(new PointArray())
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
			},
			configurable: true
		},
		map: {
			value: function(fn) {
				const mapped = new PointArray(this.length)

				for (let i = 0; i < this.length; i++) {
					mapped[i] = fn(this[i], i, this)
				}

				return mapped
			},
			configurable: true
		},
		cartProduct: {
			value: function(that) {
				return this.flatMap((e) => that.map((f) => new PointArray(e, f)))
			},
			configurable: true
		},
		interleave: {
			value: function(that = new PointArray()) {
				return new PointArray(this, that).transpose().flat()
			},
			configurable: true
		},
		rotateLeft: {
			value: function(n) {
				if (this.length == 1) {
					return this.copy()
				}

				let k = (this.length + n) % this.length
				return new PointArray(...this.slice(k), ...this.slice(0, k))
			},
			configurable: true
		},
		sort: {
			value: function(func = (a, b) => a.readingOrderCompare(b)) {
				return Array.prototype.sort.apply(this, func)
			},
			configurable: true
		},
		includes: {
			value: function(pt) {
				return pt.isIn(this)
			},
			configurable: true
		},
		indexOf: {
			value: function(pt) {
				return pt.indexIn(this)
			},
			configurable: true
		},
		lastIndexOf: {
			value: function(pt) {
				return pt.lastIndexIn(this)
			},
			configurable: true
		},
		sub: {
			value: function(that) {
				return this.filter(e => !that.pt.includes(e))
			},
			configurable: true
		},
		int: {
			value: function(that) {
				return this.filter(e => that.pt.includes(e))
			},
			configurable: true
		},
		uniq: {
			value: function() {
				return this.filter((e, i) => this.pt.indexOf(e) == i)
			},
			configurable: true
		},
		pushUniq: {
			value: function(...vals) {
				return this.push(...vals.pt.uniq().pt.sub(this))
			},
			configurable: true
		},
		count: {
			value: function(fn) {
				return this.filter(typeof fn == "function" ? fn : (e) => e.equals(fn)).length
			},
			configurable: true
		}
	})
}

load()
utils = {
	log: (e, copy = false) => (console.log(copy ? e.copyDeep() : e), e),
	fetch: (url) => fetch(url).then(e => e.text()),
	fetchEval: (url) => utils.fetch(url).then(e => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill))
}

if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")

	const year = "2021"

	for (let i = +process.argv[3] || 1; i <= 22; i++) {
		const func = require(`./${year}/${i}.js`)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8")
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").split("\n-----\n")

		let res = func(input, false)

		console.log(`${year} day ${i} part 1: Got ${res}, expected ${answers[0]}`)

		if (res == answers[0]) {
			console.log(`${year} day ${i} part 1: SUCCESS`)
		} else {
			console.error(`${year} day ${i} part 1: FAIL`)
			process.exit(1)
		}

		if (i != 25) {
			res = func(input, true)

			console.log(`${year} day ${i} part 2: Got ${res}, expected ${answers[1]}`)

			if (res == answers[1]) {
				console.log(`${year} day ${i} part 2: SUCCESS`)
			} else {
				console.error(`${year} day ${i} part 2: FAIL`)
				process.exit(1)
			}
		}
	}
}
if (typeof window == "undefined") {
	debugger
}
