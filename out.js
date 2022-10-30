// TODO:
// - copy method
// - remove range method

class DLLNode {
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

class DLL {
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


class Grid {
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

	findAll(func) {
		let points = []
		this.forEach((e, pt, grid) => func(e, pt, grid) ? points.push(pt) : 0)
		return points
	}

	contains(pt) { return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height }

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

	bfs(pt, func, neighbors = "getAdjNeighborsThat", getlimit = 1000) {
		let visited = [].pt
		let toVisit = [pt].pt
		let count = 0
		let end

		toVisit[0].path = [pt]

		out: while (toVisit.length > 0 && count++ < limit) {
			let newToVisit = [].pt

			toVisit.sort()

			for (let i = 0; i < toVisit.length; i++) {
				let result = func(this.get(toVisit[i]), toVisit[i], this, visited);

				if (result == Grid.BFS_CONTINUE) {
					newToVisit.pushUniq(...this[neighbors](toVisit[i], (pt) => !pt.isIn(visited)).map((pt) => (pt.path = [...toVisit[i].path, pt], pt)))
				}

				if (result == Grid.BFS_END) {
					end = toVisit[i]
					break out
				}
			}

			visited.pushUniq(...toVisit)
			toVisit = newToVisit
		}

		if (count >= limit) {
			console.warn("Limit reached. Aborted.")
		}

		return end || visited[visited.length - 1]
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

class BinHeap {
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

class Cxn {
	constructor(dest, weight = 1) {
		this.dest = dest
		this.weight = weight
	}
}

class SearchData {
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

class Node {
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

let warned = false

Object.defineProperties(Object.prototype, {
	copyDeep: {
		value: function() {
			return JSON.parse(JSON.stringify(this))
		}
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
		}
	}
})

Object.defineProperties(Array.prototype, {
	dll: {
		value: function() {
			return new DLL(this)
		}
	},
	copy: {
		value: function() {
			return this.slice()
		}
	},
	copyDeep: {
		value: function() {
			return JSON.parse(JSON.stringify(this))
		}
	},
	sum: {
		value: function(val) {
			return this.reduce((a, b) => a + b, val)
		}
	},
	flatDeep: {
		value: function() {
			return this.flat(Infinity)
		}
	},
	transpose: {
		value: function() {
			return Array(this[0].length).fill().map((_, i) => this.map(e => e[i]))
		}
	},
	findLast: {
		value: function(func) {
			for (let i = this.length - 1; i >= 0; i--) {
				if (func(this[i], i, this)) {
					return this[i]
				}
			}
		}
	},
	findLastIndex: {
		value: function(func) {
			for (let i = this.length - 1; i >= 0; i--) {
				if (func(this[i], i, this)) {
					return i
				}
			}

			return -1
		}
	},
	interleave: {
		value: function(that) {
			return [this, that].transpose().flat()
		}
	},
	rotate: {
		value: function(n) {
			let k = (this.length + n) % this.length
			return [...this.slice(k), ...this.slice(0, k)]
		}
	},
	sub: {
		value: function(that) {
			return this.filter(e => !that.includes(e))
		}
	},
	int: {
		value: function(that) {
			return this.filter(e => that.includes(e))
		}
	},
	uniq: {
		value: function() {
			return this.filter((e, i) => this.indexOf(e) == i)
		}
	},
	pushUniq: {
		value: function(...vals) {
			if (!warned) {
				console.warn("You should probably use a Set")
				warned = true
			}

			return this.push(...vals.uniq().sub(this))
		}
	}
})

class PointArray extends Array {
	static convert(arr) {
		if (!(arr instanceof PointArray)) {
			arr.__proto__ = PointArray.prototype
		}

		return arr
	}
}

PtArray = PointArray

Object.defineProperty(Array.prototype, "pt", {
	get: function() {
		return PointArray.convert(this)
	}
})

Object.defineProperties(PointArray.prototype, {
	sort: {
		value: function(func = (a, b) => a.readingOrderCompare(b)) {
			return Array.prototype.sort.apply(this, func)
		}
	},
	includes: {
		value: function(pt) {
			return pt.isIn(this)
		}
	},
	indexOf: {
		value: function(pt) {
			return pt.indexIn(this)
		}
	},
	lastIndexOf: {
		value: function(pt) {
			return pt.lastIndexIn(this)
		}
	},
	sub: {
		value: function(that) {
			return this.filter(e => !that.pt.includes(e))
		}
	},
	int: {
		value: function(that) {
			return this.filter(e => that.pt.includes(e))
		}
	},
	uniq: {
		value: function() {
			return this.filter((e, i) => this.pt.indexOf(e) == i)
		}
	},
	pushUniq: {
		value: function(...vals) {
			return this.push(...vals.pt.uniq().pt.sub(this))
		}
	}
})

utils = {
	fetch: (url) => fetch(url).then(e => e.text()),
	fetchEval: (url) => utils.fetch(url).then(e => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill))
}

