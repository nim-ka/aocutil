DLLNode = class DLLNode {
	constructor(val, prev = this, next = this) {
		this.val = val
		this.prev = prev
		this.next = next
	}

	adv(n = 1) {
		let node = this

		if (n < 0) {
			while (n++) {
				node = node.prev
			}
		} else {
			while (n--) {
				node = node.next
			}
		}

		return node
	}
}

DLL = class DLL {
	constructor(...a) {
		this.h = undefined
		this.length = 0

		this.push(...a)
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

	insValAheadNode(old, val) { return this.insNodeAheadNode(old, new DLLNode(val)) }

	insNodeStart(node) {
		if (this.h) {
			this.insNodeBehindNode(this.h, node)
			this.h = node
			return this.length
		} else {
			this.h = node
			return ++this.length
		}
	}

	insDLLStart(dll) {
		if (this.h) {
			this.insDLLBehindNode(this.h, dll)
			this.h = dll.h
			return this.length
		} else {
			this.h = dll.h
			return this.length = dll.length
		}
	}

	insValStart(val) { return this.insNodeStart(new DLLNode(val)) }

	unshift(...vals) {
		let ret
		vals.reverse().forEach((val) => ret = this.insValStart(val))
		return ret
	}

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

	insValBehindNode(old, val) {
		let node = new DLLNode(val, old.prev, old)
		old.prev = node
		old.prev.prev.next = node
		return ++this.length
	}

	insNodeEnd(node) {
		if (this.h) {
			return this.insNodeBehindNode(this.h, node)
		} else {
			this.h = node
			return ++this.length
		}
	}

	insDLLEnd(dll) {
		if (this.h) {
			return this.insDLLBehindNode(this.h, dll)
		} else {
			this.h = dll.h
			return this.length = dll.length
		}
	}

	insValEnd(val) { return this.insNodeEnd(new DLLNode(val)) }

	push(...vals) {
		let ret
		vals.forEach((val) => ret = this.insValEnd(val))
		return ret
	}

	insNodeBehindIdx(idx, node) { return this.insNodeBehindNode(this.getNode(idx), node) }
	insDLLBehindIdx(idx, dll) { return this.insDLLBehindNode(this.getNode(idx), dll) }
	insValBehindIdx(idx, val) { return this.insValBehindNode(this.getNode(idx), val) }
	insNodeAheadIdx(idx, node) { return this.insNodeAheadNode(this.getNode(idx), node) }
	insDLLAheadIdx(idx, dll) { return this.insDLLAheadNode(this.getNode(idx), dll) }
	insValAheadIdx(idx, val) { return this.insValAheadNode(this.getNode(idx), val) }

	removeNode(node) {
		let tmp = node.next
		node.prev.next = node.next
		tmp.prev = node.prev
		this.length--

		if (node == this.h) {
			this.h = this.h.next
		}

		if (this.length == 0) {
			this.h = undefined
		}

		return node
	}

	removeIdx(idx) { return this.removeNode(this.getNode(idx)).val }

	shift() { return this.removeIdx(0) }
	pop() { return this.removeIdx(-1) }

	removeNodeRange(start, end) {
		let result = new DLL()

		while (start != end) {
			let next = start.next
			result.insNodeEnd(this.removeNode(start))
			start = next
		}

		return result
	}

	removeIdxRange(startIdx, endIdx) { return this.removeNodeRange(this.getNode(startIdx), this.getNode(endIdx)) }

	getNode(idx) { return this.h.adv(idx) }
	get(idx) { return this.getNode(idx).val }

	reverse() {
		if (!this.h) {
			return this
		}

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

	rotateForward(rot) {
		this.h = this.h.adv(rot)
		return this
	}

	rotateBackward(rot) {
		this.h = this.h.adv(-rot)
		return this
	}

	forEach(f) {
		if (!this.h) {
			return this
		}

		let i = 0, node = this.h

		do {
			f(node.val, node, i++, this)
			node = node.next
		} while (node != this.h)

		return this
	}

	mapMut(f) { return this.forEach((val, node, idx, dll) => node.val = f(val, node, idx, dll)) }
	map(f) { return this.copy().mapMut(f) }

	includes(val) {
		let res = false
		this.forEach((e) => res ||= e == val)
		return res
	}

	toArray() {
		let arr = new Array(this.length)
		this.forEach((el, _, idx) => arr[idx] = el)
		return arr
	}

	toJSON() { return this.toArray() }
	toString() { return this.toArray().toString() }

	copy() {
		let that = new DLL()
		this.forEach((e) => that.push(e))
		return that
	}
}


Pt = Point = class Point {
	constructor(x, y, z) {
		this.is3D = z != undefined
		this.x = x
		this.y = y
		this.z = z
	}

	equals(pt) { return this.x == pt.x && this.y == pt.y && (!this.is3D || this.z == pt.z) }

	encode(width) { return this.x | (this.y << width) }
	encode3D(width) { return this.x | (this.y << width) | (this.z << (width * 2)) }

	static decode(width, num) {
		let mask = (1 << width) - 1
		return new Point(num & mask, num >> width)
	}

	static decode3D(width, num) {
		let mask = (1 << width) - 1
		return new Point(num & mask, (num >> width) & mask, num >> (width * 2))
	}

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

	norm() { return this.mult(1 / this.mag()) }
	normMut() { return this.multMut(1 / this.mag()) }

	squaredDist(pt) { return this.sub(pt).squaredMag() }
	dist(pt) { return this.sub(pt).mag() }

	lineTo(that, halfOpen = false) {
		if (this.is3D != that.is3D) {
			console.error("Point.lineTo: Tried to make line between 2D point and 3D point")
			return
		}

		let line = new PointArray()

		let dir = new Point(
			Math.sign(that.x - this.x),
			Math.sign(that.y - this.y),
			this.is3D ? Math.sign(that.z - this.z) : undefined)

		let pt = this.copy()

		while (!that.equals(pt)) {
			if (pt.x == that.x) {
				console.error("Point.lineTo: Line not straight")
				return
			}

			line.push(pt)
			pt = pt.add(dir)
		}

		if (!halfOpen) {
			line.push(pt)
		}

		return line
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
			return this
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

	indexOf(el) {
		return this.data.indexOf(el)
	}

	findIndex(func) {
		return this.data.findIndex(func)
	}

	extractIdx(idx) {
		let oldVal = this.data[idx]

		if (this.data.length > 1) {
			this.update(idx, this.data.pop())
		} else if (idx == 0) {
			this.data = []
		}

		return oldVal
	}

	update(idx, newVal) {
		let oldVal = this.data[idx]
		this.data[idx] = newVal

		if (this.cond(oldVal, newVal)) {
			this.down(idx)
		} else {
			this.up(idx)
		}

		return oldVal
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
	static SUPPRESS_PRINTING = false

	constructor(val) {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.cxns = []
		this.searchData = new SearchData()
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

	dijkstraTo(dest, addCxns, heapCond = (p, c, pdist, cdist) => pdist < cdist) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			console.error("Node.dijkstraTo: Unrecognized destination type")
		}

		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (!Node.SUPPRESS_PRINTING) {
			console.time("search")
		}

		let i = 0

		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist

			if (isDest(min)) {
				if (!Node.SUPPRESS_PRINTING) {
					console.timeEnd("search")
				}

				min.searchData.get(id)
				return min
			}

			if (addCxns && min.cxns.length == 0) {
				addCxns(min)
			}

			min.cxns.forEach((cxn) => {
				let visited = cxn.dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (cxn.dest.searchData.update(id, dist, min, true)) {
					if (visited) {
						heap.up(heap.data.indexOf(cxn.dest))
					} else {
						heap.insert(cxn.dest)
					}
				}
			})

			if (++i % 10000 == 0) {
				console.log(heap.data.length)
			}
		}

		if (!Node.SUPPRESS_PRINTING) {
			console.timeEnd("search")
			console.warn("Node.dijkstraTo: Could not find a path")
		}
	}
}

Instruction = class Instruction {
	constructor(command, types, args, varargs = false) {
		if (types.length != args.length && !varargs) {
			console.warn(`new Instruction: Attempted to create ${command} instruction: Expected ${types.length} arguments, got ${args.length} arguments`)
			console.log(args)
		}

		this.command = command
		this.args = args.map((e, i) => (types[i] ?? types[types.length - 1])(e))
	}
}

// example command:
//
// addi: {
//     types: [ String, String, Number ],
//     op: function(dest, src, imm) {
//         this.regs[dest] = this.src[dest] + imm
//     }
// }

VM = class VM {
	get r() {
		return this.regs
	}

	constructor(init = () => {}, commands = {}, autoIncrementPc = true) {
		if (init instanceof Function) {
			this.init = function() {
				this.regs = utils.createMap(0)
				init.apply(this)
			}
		} else if (init) {
			this.init = function() {
				this.regs = utils.createMap(0, init)
			}
		}

		this.commands = commands
		this.autoIncrementPc = autoIncrementPc

		this.clearProgram()
		this.reset()
	}

	addCommand(name, command) {
		this.commands[name] = command
	}

	removeCommand(name) {
		return delete this.commands[name]
	}

	reset() {
		this.init()
		this.regs.pc = 0
	}

	parseLine(line) {
		let words = line.split(/\s+/)

		if (!words.length) {
			return
		}

		let command = words.shift()

		if (!(command in this.commands)) {
			console.error(`VM.parseLine: Unrecognized command: ${command}`)
		}

		return new Instruction(command, this.commands[command].types ?? [], words, this.commands[command].varargs)
	}

	executeInstruction(instr) {
		return this.commands[instr.command].op.apply(this, instr.args)
	}

	loadProgram(str) {
		this.clearProgram()

		let lines = str.split("\n")

		for (let i = 0; i < lines.length; i++) {
			let instr = this.parseLine(lines[i])

			if (instr) {
				this.program.push(instr)
			}
		}
	}

	clearProgram() {
		this.program = []
	}

	run(limit = 100000) {
		while (true) {
			if (--limit <= 0) {
				console.warn(`VM.run: Run limit reached; stopping`)
				break
			}

			let instr = this.program[this.regs.pc]

			if (!instr) {
				console.warn(`VM.run: No instruction found at PC ${this.regs.pc}; stopping`)
				break
			}

			this.executeInstruction(instr)

			if (this.autoIncrementPc) {
				this.regs.pc++
			}
		}
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

S = function S(...args) {
	return new Set(args)
}

function functify(el) {
	if (el instanceof RegExp) {
		return (e) => el.test(e)
	} else if (el instanceof Function) {
		return el
	}

	return (e) => e == el
}

const arrayAliases = {}

alias = function alias(proto, alias, original, isFunc = true) {
	if (proto == Array.prototype) {
		arrayAliases[alias] = original
	}

	if (isFunc) {
		Object.defineProperty(proto, alias, {
			value: {
				[original](...args) {
					return this[original](...args)
				}
			}[original],
			configurable: true
		})
	} else {
		Object.defineProperty(proto, alias, {
			get: function get() {
				return this[original]
			},
			set: function set(val) {
				this[original] = val
			},
			configurable: true
		})
	}
}

load = function load() {
	Object.defineProperty(globalThis, "input", {
		get: function input() {
			return document.body.innerText.trimEnd()
		},
		configurable: true
	})

	for (let primitive of [ Boolean, Number, BigInt, String, Symbol ]) {
		Object.defineProperty(primitive, Symbol.hasInstance, {
			value: function(val) {
				return val.constructor == primitive
			},
			configurable: true
		})
	}

	Object.defineProperties(Number.prototype, {
		chr: {
			value: function chr() {
				return String.fromCharCode(this)
			},
			configurable: true
		},
		gcd: {
			value: function gcd(...args) {
				return utils.gcd(this, ...args)
			},
			configurable: true
		},
		lcm: {
			value: function lcm(...args) {
				return utils.lcm(this, ...args)
			},
			configurable: true
		},
		isPrime: {
			value: function isPrime() {
				return utils.isPrime(this)
			},
			configurable: true
		},
		primeFactors: {
			value: function primeFactors() {
				return utils.primeFactors(this)
			},
			configurable: true
		},
		factors: {
			value: function factors() {
				return utils.factors(this)
			},
			configurable: true
		}
	})

	Object.defineProperties(String.prototype, {
		count: {
			value: function count(el) {
				let func = functify(el)

				let count = 0

				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
						count++
					}
				}

				return count
			},
			configurable: true
		},
		splitEvery: {
			value: function splitEvery(n) {
				let arr = [""]

				for (let i = 0; i < this.length; i++) {
					if (arr[arr.length - 1].length >= n) {
						arr.push(this[i])
					} else {
						arr[arr.length - 1] += this[i]
					}
				}

				return arr
			},
			configurable: true
		},
		splitOn: {
			value: function splitOn(sep) {
				let func = functify(sep)

				let arr = [""]

				for (let i = 0; i < this.length; i++) {
					if (func(this[i])) {
						arr.push("")
					} else {
						arr[arr.length - 1] += this[i]
					}
				}

				return arr
			},
			configurable: true
		},
		posints: {
			value: function posints() {
				return this.match(/\d+/g)?.num() ?? []
			},
			configurable: true
		},
		ints: {
			value: function ints() {
				return this.match(/-?\d+/g)?.num() ?? []
			},
			configurable: true
		},
		nums: {
			value: function nums() {
				return this.match(/-?\d+(\.\d+)?/g)?.num() ?? []
			},
			configurable: true
		}
	})

	Object.defineProperties(Object.prototype, {
		is: {
			value: function is(cons) {
				return this instanceof cons
			},
			configurable: true
		},
		arr: {
			value: function arr() {
				return [...this]
			},
			configurable: true
		},
		copyDeep: {
			value: function copyDeep() {
				return JSON.parse(JSON.stringify(this))
			},
			configurable: true
		},
		num: {
			value: function num() {
				if (this.map) {
					return this.map((e) => +e)
				} else {
					console.error("Object.prototype.num: No suitable map method found")
				}
			},
			configurable: true
		},
		numMut: {
			value: function numMut() {
				if (this.mapMut) {
					return this.mapMut((e) => +e)
				} else {
					console.error("Object.prototype.numMut: No suitable map method found")
				}
			},
			configurable: true
		},
		keys: {
			value: function keys() {
				return Object.keys(this)
			},
			configurable: true
		},
		values: {
			value: function values() {
				return Object.values(this)
			},
			configurable: true
		},
		entriesArr: {
			value: function entriesArr() {
				return Object.entries(this)
			},
			configurable: true
		}
	})

	Object.defineProperties(Array.prototype, {
		pt: {
			get: function pt() {
				return PointArray.convert(this)
			},
			configurable: true
		},
		entriesArr: {
			value: function entriesArr() {
				return [...this.entries()]
			},
			configurable: true
		},
		set: {
			value: function set() {
				return new Set(this)
			},
			configurable: true
		},
		last: {
			get: function lastGet() {
				return this[this.length - 1]
			},
			set: function lastSet(val) {
				this[this.length - 1] = val
			},
			configurable: true
		},
		startsWith: {
			value: function startsWith(that) {
				for (let i = 0; i < that.length; i++) {
					if (this[i] != that[i]) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		endsWith: {
			value: function endsWith(that) {
				for (let i = 0; i < that.length; i++) {
					if (this[this.length - i - 1] != that[that.length - i - 1]) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		repeat: {
			value: function repeat(n) {
				let arr = new Array(this.length * n)

				for (let i = 0; i < this.length * n; i++) {
					arr[i] = this[i % this.length]
				}

				return arr
			},
			configurable: true
		},
		dll: {
			value: function dll() {
				return new DLL(...this)
			},
			configurable: true
		},
		truthy: {
			value: function truthy() {
				return this.filter((e) => e)
			},
			configurable: true
		},
		no: {
			value: function no(fn) {
				return !this.some(fn)
			},
			configurable: true
		},
		findIndices: {
			value: function findIndices(el) {
				let func = functify(el)

				let arr = []

				for (let i = 0; i < this.length; i++) {
					if (func(this[i])) {
						arr.push(i)
					}
				}

				return arr
			},
			configurable: true
		},
		splitEvery: {
			value: function splitEvery(n) {
				let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (arr[arr.length - 1].length >= n) {
						arr.push([this[i]])
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
			},
			configurable: true
		},
		splitOn: {
			value: function splitOn(sep) {
				let func = functify(sep)

				let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (func(this[i])) {
						arr.push([])
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
			},
			configurable: true
		},
		copyDeep: {
			value: function copyDeep() {
				return JSON.parse(JSON.stringify(this))
			},
			configurable: true
		},
		mapArr: {
			value: function mapArr(fn) {
				const mapped = new Array(this.length)

				for (let i = 0; i < this.length; i++) {
					mapped[i] = fn(this[i], i, this)
				}

				return mapped
			},
			configurable: true
		},
		sortNumAsc: {
			value: function sortNumAsc() {
				return this.sort((a, b) => a - b)
			},
			configurable: true
		},
		sortNumDesc: {
			value: function sortNumAsc() {
				return this.sort((a, b) => b - a)
			},
			configurable: true
		},
		sum: {
			value: function sum(val = 0) {
				return this.reduce((a, b) => a + b, val)
			},
			configurable: true
		},
		mult: {
			value: function mult(val = 1) {
				return this.reduce((a, b) => a * b, val)
			},
			configurable: true
		},
		cartProduct: {
			value: function cartProduct(that = this) {
				return this.flatMap((e) => that.map((f) => [e, f]))
			},
			configurable: true
		},
		pairsExcl: {
			value: function pairsExcl() {
				return this.flatMap((e, i) => this.filter((_, j) => i != j).map((f) => [e, f]))
			},
			configurable: true
		},
		flatDeep: {
			value: function flatDeep() {
				return this.flat(Infinity)
			},
			configurable: true
		},
		transpose: {
			value: function transpose() {
				return this[0].map((_, i) => this.map(e => e[i]))
			},
			configurable: true
		},
		interleave: {
			value: function interleave(that) {
				return [this, that].transpose().flat()
			},
			configurable: true
		},
		rotateLeft: {
			value: function rotateLeft(n) {
				let k = (this.length + n) % this.length
				return [...this.slice(k), ...this.slice(0, k)]
			},
			configurable: true
		},
		rotateRight: {
			value: function rotateRight(n) {
				let k = (this.length - n) % this.length
				return [...this.slice(k), ...this.slice(0, k)]
			},
			configurable: true
		},
		sub: {
			value: function sub(that) {
				return this.filter(e => !that.includes(e))
			},
			configurable: true
		},
		int: {
			value: function int(that) {
				return this.filter(e => that.includes(e))
			},
			configurable: true
		},
		uniq: {
			value: function uniq() {
				return this.filter((e, i) => this.indexOf(e) == i)
			},
			configurable: true
		},
		dups: {
			value: function dups() {
				return this.filter((e, i) => this.indexOf(e) != i)
			},
			configurable: true
		},
		isUniq: {
			value: function isUniq() {
				return this.no((e, i) => this.indexOf(e) != i)
			},
			configurable: true
		},
		pushUniq: {
			value: function pushUniq(...vals) {
				if (!warned) {
					console.warn("You should probably use a Set")
					warned = true
				}

				for (let i = 0; i < vals.length; i++) {
					if (!this.includes(vals[i])) {
						this.push(vals[i])
					}
				}

				return this.length
			},
			configurable: true
		},
		count: {
			value: function count(el) {
				let func = functify(el)

				let count = 0

				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
						count++
					}
				}

				return count
			},
			configurable: true
		},
		minIndex: {
			value: function minIndex(fn = (e) => e, tiebreak) {
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
			value: function min(fn, tiebreak) {
				return this[this.minIndex(fn, tiebreak)]
			},
			configurable: true
		},
		maxIndex: {
			value: function maxIndex(fn = (e) => e, tiebreak) {
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
			value: function max(fn, tiebreak) {
				return this[this.maxIndex(fn, tiebreak)]
			},
			configurable: true
		},
		mean: {
			value: function mean() {
				return this.sum() / this.length
			},
			configurable: true
		},
		medianNumeric: {
			value: function medianNumeric() {
				let sorted = this.copy().sort((a, b) => a - b)

				if (sorted.length % 2) {
					return sorted[(sorted.length - 1) / 2]
				} else {
					return (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
				}
			},
			configurable: true
		},
		freqs: {
			value: function freqs() {
				return this.uniq().map((e) => [e, this.count(e)])
			},
			configurable: true
		},
		mode: {
			value: function mode(tiebreak) {
				return this.freqs().max((e) => e[1], tiebreak ? (a, b, ai, bi) => tiebreak(a[0], b[0]) : undefined)[0]
			},
			configurable: true
		},
		antimode: {
			value: function antimode(tiebreak) {
				return this.freqs().min((e) => e[1], tiebreak ? (a, b, ai, bi) => tiebreak(a[0], b[0]) : undefined)[0]
			},
			configurable: true
		},
		x: {
			value: function x(el) {
				return this.findIndex(functify(el))
			},
			configurable: true
		}
	})

	Object.defineProperties(PointArray.prototype, {
		arr: {
			value: function arr() {
				return PointArray.revert(this)
			},
			configurable: true
		},
		startsWith: {
			value: function startsWith(that) {
				for (let i = 0; i < that.length; i++) {
					if (!this[i].equals(that[i])) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		endsWith: {
			value: function endsWith(that) {
				for (let i = 0; i < that.length; i++) {
					if (!this[this.length - i - 1].equals(that[that.length - i - 1])) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		repeat: {
			value: function repeat(n) {
				let arr = new PointArray(this.length * n)

				for (let i = 0; i < this.length * n; i++) {
					arr[i] = this[i % this.length]
				}

				return arr
			},
			configurable: true
		},
		splitEvery: {
			value: function splitEvery(n) {
				let arr = [new PointArray()]

				for (let i = 0; i < this.length; i++) {
					if (arr[arr.length - 1].length >= n) {
						arr.push(new PointArray(this[i]))
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
			},
			configurable: true
		},
		splitOn: {
			value: function splitOn(sep) {
				let func

				if (sep instanceof Function) {
					func = sep
				} else {
					func = (el) => sep.equals(el)
				}

				for (let i = 0; i < this.length; i++) {
					if (func(this[i])) {
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
			value: function map(fn) {
				const mapped = new PointArray(this.length)

				for (let i = 0; i < this.length; i++) {
					mapped[i] = fn(this[i], i, this)
				}

				return mapped
			},
			configurable: true
		},
		cartProduct: {
			value: function cartProduct(that = this) {
				return this.flatMap((e) => that.map((f) => new PointArray(e, f)))
			},
			configurable: true
		},
		pairsExcl: {
			value: function pairsExcl() {
				return this.flatMap((e, i) => this.filter((_, j) => i != j).map((f) => new PointArray(e, f)))
			},
			configurable: true
		},
		interleave: {
			value: function interleave(that = new PointArray()) {
				return new PointArray(this, that).transpose().flat()
			},
			configurable: true
		},
		rotateLeft: {
			value: function rotateLeft(n) {
				if (this.length == 1) {
					return this.copy()
				}

				let k = (this.length + n) % this.length
				return new PointArray(...this.slice(k), ...this.slice(0, k))
			},
			configurable: true
		},
		rotateRight: {
			value: function rotateRight(n) {
				if (this.length == 1) {
					return this.copy()
				}

				let k = (this.length - n) % this.length
				return new PointArray(...this.slice(k), ...this.slice(0, k))
			},
			configurable: true
		},
		sort: {
			value: function sort(func = (a, b) => a.readingOrderCompare(b)) {
				return Array.prototype.sort.apply(this, [func])
			},
			configurable: true
		},
		includes: {
			value: function includes(pt) {
				return pt.isIn(this)
			},
			configurable: true
		},
		indexOf: {
			value: function indexOf(pt) {
				return pt.indexIn(this)
			},
			configurable: true
		},
		lastIndexOf: {
			value: function lastIndexOf(pt) {
				return pt.lastIndexIn(this)
			},
			configurable: true
		},
		sub: {
			value: function sub(that) {
				return this.filter(e => !that.pt.includes(e))
			},
			configurable: true
		},
		int: {
			value: function int(that) {
				return this.filter(e => that.pt.includes(e))
			},
			configurable: true
		},
		count: {
			value: function count(el) {
				let func

				if (el instanceof Function) {
					func = el
				} else {
					func = (e) => el.equals(e)
				}

				let count = 0

				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
						count++
					}
				}

				return count
			},
			configurable: true
		}
	})

	Object.defineProperties(Set.prototype, {
		push: {
			value: function push(...vals) {
				for (let val of vals) {
					this.add(val)
				}

				return this
			},
			configurable: true
		},
		copy: {
			value: function copy() {
				let set = new Set()

				for (let val of this) {
					set.add(val)
				}

				return set
			},
			configurable: true
		},
		unionMut: {
			value: function unionMut(that) {
				for (let val of that) {
					this.add(val)
				}

				return this
			},
			configurable: true
		},
		union: {
			value: function union(that) {
				let set = new Set()

				for (let val of this) {
					set.add(val)
				}

				for (let val of that) {
					set.add(val)
				}

				return set
			},
			configurable: true
		},
		subMut: {
			value: function subMut(that) {
				for (let val of that) {
					this.delete(val)
				}

				return this
			},
			configurable: true
		},
		sub: {
			value: function sub(that) {
				let set = new Set()

				for (let val of this) {
					if (!that.has(val)) {
						set.add(val)
					}
				}

				return set
			},
			configurable: true
		},
		intMut: {
			value: function intMut(that) {
				for (let val of this) {
					if (!that.has(val)) {
						this.delete(val)
					}
				}

				return this
			},
			configurable: true
		},
		int: {
			value: function int(that) {
				let set = new Set()

				for (let val of this) {
					if (that.has(val)) {
						set.add(val)
					}
				}

				return set
			},
			configurable: true
		},
		symDiffMut: {
			value: function symDiffMut(that) {
				for (let val of that) {
					if (this.has(val)) {
						this.delete(val)
					} else {
						this.add(val)
					}
				}

				return this
			},
			configurable: true
		},
		symDiff: {
			value: function symDiff(that) {
				let set = new Set()

				for (let val of this) {
					if (!that.has(val)) {
						set.add(val)
					}
				}

				for (let val of that) {
					if (!this.has(val)) {
						set.add(val)
					}
				}

				return set
			},
			configurable: true
		},
		isSupersetOf: {
			value: function isSupersetOf(that) {
				for (let val of that) {
					if (!this.has(val)) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		isSubsetOf: {
			value: function isSubsetOf(that) {
				for (let val of this) {
					if (!that.has(val)) {
						return false
					}
				}

				return true
			},
			configurable: true
		},
		equals: {
			value: function equals(that) {
				return this.isSupersetOf(that) && this.isSubsetOf(that)
			},
			configurable: true
		},
		isProperSupersetOf: {
			value: function isProperSupersetOf(that) {
				return this.isSupersetOf(that) && !this.isSubsetOf(that)
			},
			configurable: true
		},
		isProperSubsetOf: {
			value: function isProperSubsetOf(that) {
				return this.isSubsetOf(that) && !this.isSupersetOf(that)
			},
			configurable: true
		}
	})

	alias(Object.prototype, "ea", "entriesArr")
	alias(Object.prototype, "en", "entriesArr")
	alias(Object.prototype, "ie", "entriesArr")
	alias(Object.prototype, "ts", "toString")

	alias(Array.prototype, "am", "antimode")
	alias(Array.prototype, "cart", "cartProduct")
	alias(Array.prototype, "c", "count")
	alias(Array.prototype, "ew", "endsWith")
	alias(String.prototype, "ew", "endsWith")
	alias(Array.prototype, "e", "every")
	alias(Array.prototype, "f", "filter")
	alias(Array.prototype, "fn", "find")
	alias(Array.prototype, "fni", "findIndex")
	alias(Array.prototype, "fnx", "findIndex")
	alias(Array.prototype, "fx", "findIndex")
	alias(Array.prototype, "fnia", "findIndices")
	alias(Array.prototype, "fnxa", "findIndices")
	alias(Array.prototype, "fxa", "findIndices")
	alias(Array.prototype, "fnl", "findLast")
	alias(Array.prototype, "fnli", "findLastIndex")
	alias(Array.prototype, "fnlx", "findLastIndex")
	alias(Array.prototype, "flx", "findLastIndex")
	alias(Array.prototype, "fl", "flat")
	alias(Array.prototype, "fld", "flatDeep")
	alias(Array.prototype, "for", "forEach")
	alias(Array.prototype, "h", "includes")
	alias(String.prototype, "h", "includes")
	alias(Array.prototype, "has", "includes")
	alias(String.prototype, "has", "includes")
	alias(Array.prototype, "iu", "isUniq")
	alias(Array.prototype, "j", "join")
	alias(Array.prototype, "li", "lastIndexOf")
	alias(String.prototype, "li", "lastIndexOf")
	alias(Array.prototype, "l", "length", false)
	alias(String.prototype, "l", "length", false)
	alias(Set.prototype, "l", "length", false)
	alias(Array.prototype, "m", "map")
	alias(Array.prototype, "ma", "mapArr")
	alias(Array.prototype, "maxi", "maxIndex")
	alias(Array.prototype, "maxx", "maxIndex")
	alias(Array.prototype, "mini", "minIndex")
	alias(Array.prototype, "minx", "minIndex")
	alias(Array.prototype, "n", "num")
	alias(Array.prototype, "nm", "numMut")
	alias(String.prototype, "pe", "padEnd")
	alias(String.prototype, "ps", "padStart")
	alias(Array.prototype, "pu", "pushUniq")
	alias(Array.prototype, "r", "reduce")
	alias(Array.prototype, "rep", "repeat")
	alias(String.prototype, "rep", "repeat")
	alias(String.prototype, "re", "replace")
	alias(String.prototype, "rea", "replaceAll")
	alias(Array.prototype, "_", "reverse")
	alias(Array.prototype, "rl", "rotateLeft")
	alias(Array.prototype, "rr", "rotateRight")
	alias(Array.prototype, "S", "set")
	alias(Array.prototype, "sl", "slice")
	alias(String.prototype, "sl", "slice")
	alias(Array.prototype, "sorta", "sortNumAsc")
	alias(Array.prototype, "sortd", "sortNumDesc")
	alias(Array.prototype, "spl", "splice")
	alias(Array.prototype, "s", "split")
	alias(String.prototype, "s", "split")
	alias(Array.prototype, "sv", "splitEvery")
	alias(String.prototype, "sv", "splitEvery")
	alias(Array.prototype, "so", "splitOn")
	alias(String.prototype, "so", "splitOn")
	alias(Array.prototype, "sw", "startsWith")
	alias(String.prototype, "sw", "startsWith")
	alias(Array.prototype, "t", "transpose")
	alias(Array.prototype, "ft", "truthy")
	alias(Array.prototype, "u", "uniq")
	alias(Array.prototype, "x", "indexOf")
	alias(String.prototype, "x", "indexOf")

	alias(String.prototype, "lower", "toLowerCase")
	alias(String.prototype, "upper", "toUpperCase")
	alias(String.prototype, "ord", "charCodeAt")

	alias(Array.prototype, "copy", "slice")
	alias(Array.prototype, "prod", "mult")

	alias(Set.prototype, "length", "size", false)
	alias(Set.prototype, "empty", "clear")
	alias(Set.prototype, "remove", "delete")
	alias(Set.prototype, "includes", "has")

	for (let name of Object.getOwnPropertyNames(Array.prototype)) {
		for (let proto of [String.prototype, Set.prototype]) {
			if (!(name in proto)) {
				proto[name] = {
					[name](...args) {
						return [...this][name](...args)
					}
				}[name]
			}
		}

		if (!(name in Grid.prototype) && name in arrayAliases) {
			let original = arrayAliases[name]

			if (!(original in Grid.prototype)) {
				//console.warn(`Couldn't find Grid.${original} method`)
			} else {
				Grid.prototype[name] = {
					[name](...args) {
						return this[original](...args)
					}
				}[name]
			}
		}
	}
}

load()

if (typeof window != "undefined") {
	a = input
	cb = a.split("\n")
}

utils = {
	log: (e, ...args) => (console.log(e, ...args), e),
	logCopy: (e, ...args) => (console.log(e.copyDeep(), ...args), e),
	fetchText: (...args) => fetch(...args).then((e) => e.text()),
	fetchEval: (...args) => utils.fetchText(...args).then((e) => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill)),
	// num utils because numbers are weird
	gcd2: (a, b) => {
		while (b) {
			[a, b] = [b, a % b]
		}

		return a
	},
	gcd: (...args) => args.length ? args.reduce(utils.gcd2) : 0,
	lcm2: (a, b) => a && b ? a * (b / utils.gcd2(a, b)) : 0,
	lcm: (...args) => args.length ? args.reduce(utils.lcm2) : 0,
	isPrime: (n) => {
		for (let i = 2; i * i <= n; i++) {
			if (n % i == 0) {
				return false
			}
		}

		return true
	},
	primeFactors: (n) => {
		let arr = []

		for (let i = 2; n > 1;) {
			if (i * i > n) {
				arr.push(+n)
				break
			} else if (n % i == 0) {
				arr.push(i)
				n /= i
			} else {
				i++
			}
		}

		return arr
	},
	factors: (n) => {
		let arr = []
		let arr2 = []

		for (let i = 1; i * i <= n; i++) {
			if (n % i == 0) {
				arr.push(i)

				if (i != n / i) {
					arr2.unshift(n / i)
				}
			}
		}

		return [...arr, ...arr2]
	},
	lock: (obj, val) => {
		let proxy

		let func = val instanceof Function ? val : () => val

		return proxy = new Proxy(obj, {
			get(obj, prop) {
				if (prop == "obj") {
					return Object.assign({}, proxy)
				} else if (prop in obj) {
					return obj[prop]
				} else {
					return func(obj, prop)
				}
			}
		})
	},
	createMap: (val = undefined, obj) => utils.lock(Object.assign({ __proto__: null }, obj), val),
	getObject: (obj) => Object.assign({}, obj),
	emptyArray: (n, func = (e, i) => i) => Array(n).fill().map(func)
}

M = utils.createMap

N = utils.emptyArray

O = utils.getObject

L = utils.log
LC = utils.logCopy

R = utils.range = utils.signAgnosticInclusiveRange

U = function U(n) {
	return utils.emptyArray(n, (e, i) => i + 1)
}

Z = function Z(n) {
	return utils.emptyArray(n, (e, i) => i)
}

defaultPartNum = 1

A = function A(ans, part) {
	if (part != 1 && part != 2) {
		part = defaultPartNum
		console.warn(`Remember to specify part number! Defaulting to ${part}`)
	}

	console.log(`Submitting ${ans} for part ${part}`)

	let queryString = new URLSearchParams({
		"level": part.toString(),
		"answer": ans.toString()
	}).toString()

	utils.fetchText(location.href.replace("input", "answer"), {
		"headers": {
			"content-type": "application/x-www-form-urlencoded"
		},
		"body": queryString,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	}).then((text) => {
		if (text.includes("That's the right answer!")) {
			defaultPartNum = 2
		}

		console.log(text.match(/<article([\s\S]+?)article>/)[0].replace(/<.+?>/g, ""))
	})

	return ans
}

B = function B(ans) {
	return A(ans, 2)
}


if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")

	function test(name, answer, func, ...args) {
		console.time(name)
		let res = func(...args)
		console.timeEnd(name)

		console.log(`${name}: Got ${res}, expected ${answer}`)

		if (res == answer) {
			console.log(`${name}: SUCCESS`)
		} else {
			console.error(`${name}: FAIL`)
			process.exit(1)
		}
	}

	const year = "2021"

	for (let i = +process.argv[3] || 1; i <= 25; i++) {
		const func = require(`./${year}/${i}.js`)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8")
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").split("\n-----\n")

		if (i != 25) {
			test(`${year} day ${i} part 1`, answers[0], func, input, false)
			test(`${year} day ${i} part 2`, answers[1], func, input, true)
		} else {
			test(`${year} day ${i}`, answers[0], func, input)
		}
	}
}
if (typeof window == "undefined") {
	debugger
}
