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

		for (let el of a) {
			this.insValEnd(el)
		}
	}
	
	static from(a) {
		let dll = new DLL()
		
		for (let el of a) {
			dll.insValEnd(el)
		}
		
		return dll
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
			return this.insNodeBehindNode(this.h, node)
		} else {
			this.h = node
			return ++this.length
		}
	}

	insDLLStart(dll) {
		if (this.h) {
			return this.insDLLBehindNode(this.h, dll)
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
		
		if (this.h == old) {
			this.h = node
		}
		
		return ++this.length
	}

	insDLLBehindNode(old, dll) {
		let start = dll.getNode(0)
		let end = dll.getNode(-1)
		start.prev = old.prev
		old.prev.next = start
		old.prev = end
		end.next = old
		
		if (this.h == old) {
			this.h = dll.h
		}
		
		return this.length += dll.length
	}

	insValBehindNode(old, val) {
		let node = new DLLNode(val, old.prev, old)
		old.prev = node
		old.prev.prev.next = node
		
		if (this.h == old) {
			this.h = node
		}
		
		return ++this.length
	}

	insNodeEnd(node) {
		if (this.h) {
			return this.insNodeAheadNode(this.h.prev, node)
		} else {
			this.h = node
			return ++this.length
		}
	}

	insDLLEnd(dll) {
		if (this.h) {
			return this.insDLLAheadNode(this.h.prev, dll)
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
		let i = 0
		
		for (let node of this.nodes()) {
			f(node.val, node, i++, this)
		}

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
	
	*[Symbol.iterator]() {
		if (!this.h) {
			return
		}
		
		let node = this.h
		
		do {
			yield node.val
			node = node.next
		} while (node != this.h)
	}

	*nodes() {
		if (!this.h) {
			return
		}
		
		let node = this.h
		
		do {
			yield node
			node = node.next
		} while (node != this.h)
	}
}


Range = class Range {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	
	get l() {
		return this.y - this.x
	}
	
	set l(l) {
		this.y = this.x + l
	}
	
	copy() {
		return new Range(this.x, this.y)
	}
	
	set() {
		return new RangeSet([this])
	}
	
	equals(that) {
		return this.x == that.x && this.l == that.l
	}
	
	has(num) {
		return this.x <= num && num < this.y
	}
	
	isValid() {
		return this.y > this.x
	}
	
	intersects(that) {
		return this.x < that.y && that.x < this.y
	}
	
	intersection(that) {
		if (!this.intersects(that)) {
			return null
		}
		
		return new Range(Math.max(this.x, that.x), Math.min(this.y, that.y))
	}
	
	isSubset(that) {
		return this.x >= that.x && this.y <= that.y
	}
	
	isSuperset(that) {
		return this.x <= that.x && this.y >= that.y
	}
	
	*[Symbol.iterator]() {
		for (let i = this.x; i < this.y; i++) {
			yield i
		}
	}
	
	toString() {
		return `[${this.x}, ${this.y})`
	}
}

RangeSet = class RangeSet {
	constructor(ranges = []) {
		this.ranges = DLL.from(ranges)
	}
	
	get x() {
		return this.ranges.get(0).x
	}
	
	get y() {
		return this.ranges.get(-1).y
	}
	
	copy() {
		let res = new RangeSet()
		
		for (let range of this.ranges) {
			res.ranges.insValEnd(range.copy())
		}
		
		return res
	}
	
	bounds() {
		return new Range(this.x, this.y - this.x)
	}
	
	equals(that) {
		if (this.ranges.length != that.ranges.length) {
			return false
		}
		
		if (this.ranges.length == 0 || that.ranges.length == 0) {
			return this.ranges.length == that.ranges.length
		}
		
		let anode = this.ranges.getNode(0)
		let bnode = that.ranges.getNode(0)
		
		for (let i = 0; i < this.ranges.length; i++) {
			if (!anode.val.equals(bnode.val)) {
				return false
			}
			
			anode = anode.next
			bnode = bnode.next
		}
		
		return true
	}
	
	has(num) {
		for (let range of this.ranges) {
			if (range.has(num)) {
				return true
			}
		}
		
		return false
	}
	
	intersects(that) {
		if (!this.ranges.length) {
			return false
		}
		
		let start = this.ranges.getNode(0)
		let cur = start
		
		for (let range of that.ranges) {
			while (cur.val.y < range.x) {
				cur = cur.next
				
				if (cur == start) {
					return false
				}
			}
			
			if (cur.val.intersects(range)) {
				return true
			}
		}
		
		return false
	}
	
	intersectionMut(that) {
		return this.subMut(this.sub(that))
	}
	
	intersection(that) {
		return this.sub(this.sub(that))
	}
	
	isSubset(that) {
		throw new Error(`lol fuck you`)
	}
	
	isSuperset(that) {
		throw new Error(`lol fuck you`)
	}
	
	reduceMut() {
		if (this.ranges.length < 2) {
			return this
		}
		
		let start = this.ranges.getNode(0)
		let cur = start
		
		while (cur.next != start) {
			if (cur.val.y >= cur.next.val.x) {
				cur.val = new Range(cur.val.x, Math.max(cur.val.y, cur.next.val.y))
				this.ranges.removeNode(cur.next)
			} else {
				cur = cur.next
			}
		}
		
		return this
	}
	
	reduce() {
		if (this.ranges.length < 2) {
			return this.copy()
		}
		
		let res = new RangeSet()
		let last
		
		for (let range of this.ranges) {
			if (last && last.y >= range.x) {
				last.y = Math.max(last.y, range.y)
			} else {
				res.ranges.insValEnd(last = range.copy())
			}
		}
		
		return res
	}
	
	addRangeMut(range) {
		if (!range.isValid()) {
			return this
		}
		
		for (let node of this.ranges.nodes()) {
			if (range.x < node.val.x) {
				this.ranges.insValBehindNode(node, range)
				return this
			}
		}
		
		this.ranges.insValEnd(range)
		return this
	}
	
	addRange(range) {
		if (!range.isValid()) {
			return this
		}
		
		let res = new RangeSet()
		let added = false
		
		for (let node of this.ranges.nodes()) {
			if (!added && range.x < node.val.x) {
				res.ranges.insValEnd(range.copy())
				added = true
			}
			
			res.ranges.insValEnd(node.val.copy())
		}
		
		if (!added) {
			res.ranges.insValEnd(range.copy())
		}
		
		return res
	}
	
	addMut(that) {
		for (let range of that.ranges) {
			this.addRangeMut(range)
		}
		
		return this
	}
	
	add(that) {
		if (this.ranges.length == 0) {
			return that.copy()
		}
		
		let res = new RangeSet()
		
		let start = this.ranges.getNode(0)
		let cur = start
		let addedAll = false
		
		for (let range of that.ranges) {
			while (!addedAll && cur.val.x < range.x) {
				res.ranges.insValEnd(cur.val.copy())
				cur = cur.next
				
				if (cur == start) {
					addedAll = true
				}
			}
			
			res.ranges.insValEnd(range.copy())
		}
		
		while (cur != start) {
			res.ranges.insValEnd(cur.val.copy())
			cur = cur.next
		}
		
		return res
	}
	
	subRangeMut(range) {
		let cur
		
		while (this.ranges.length) {
			cur = (cur ?? this.ranges.getNode(0)).prev
			
			if (range.intersects(cur.val)) {
				let left = new Range(cur.val.x, range.x)
				let right = new Range(range.y, cur.val.y)
				
				if (right.isValid()) {
					this.ranges.insValAheadNode(cur, right)
				}
				
				if (left.isValid()) {
					cur.val = left
				} else {
					let next = cur.next
					this.ranges.removeNode(cur)
					cur = next
				}
			}
			
			if (this.ranges.length && cur == this.ranges.getNode(0)) {
				break
			}
		}
		
		return this
	}
	
	subRange(range) {
		let res = new RangeSet()
		let cur
		
		while (this.ranges.length) {
			cur = (cur ?? this.ranges.getNode(0)).prev
			
			if (range.intersects(cur.val)) {
				let left = new Range(cur.val.x, range.x)
				let right = new Range(range.y, cur.val.y)
				
				if (right.isValid()) {
					res.addRangeMut(right)
				}
				
				if (left.isValid()) {
					res.addRangeMut(left)
				}
			} else {
				res.ranges.insValStart(cur.val)
			}
			
			if (this.ranges.length && cur == this.ranges.getNode(0)) {
				break
			}
		}
		
		return res
	}
	
	subMut(that) {
		for (let range of that.ranges) {
			this.subRangeMut(range)
		}
		
		return this
	}
	
	sub(that) {
		let res = this.copy()
		
		for (let range of that.ranges) {
			res.subRangeMut(range)
		}
		
		return res
	}
	
	count() {
		let sum = 0
		
		for (let range of this.reduce().ranges) {
			sum += range.l
		}
		
		return sum
	}
	
	*[Symbol.iterator]() {
		for (let range of this.reduce().ranges) {
			yield* range
		}
	}
	
	toString() {
		let str = ""
		
		for (let node of this.ranges.nodes()) {
			str += node.val.toString()
			
			if (node.next != this.ranges.getNode(0)) {
				str += "; "
			}
		}
		
		return str
	}
}

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

	squaredDist(pt) { return (this.x - pt.x) * (this.x - pt.x) + (this.y - pt.y) * (this.y - pt.y) + (this.is3D ? (this.z - pt.z) * (this.z - pt.z) : 0) }
	dist(pt) { return Math.sqrt(this.squaredDist(pt)) }

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
		
		let visited = new NumericPointSet()
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
				for (let neighbor of this[neighbors](pt).filter((pt) => !visited.has(pt))) {
					neighbor.dist = pt.dist + 1
					neighbor.last = pt
					toVisit.insert(neighbor)
				}
			}
			
			visited.add(pt)
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
		this.forEach((e, pt) => this[neighbors](pt).forEach((pt2) => cxn(e, this.get(pt2), pt, pt2)))
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
	
	*[Symbol.iterator]() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				yield this.data[y][x]
			}
		}
	}
}

G = function G(...args) {
	if (typeof args[0] == "string") {
		return Grid.fromStr(...args)
	}

	return new Grid(...args)
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
		while (idx > 0) {
			let parent = idx / 2 | 0
			
			if (this.cond(this.data[parent], this.data[idx])) {
				break
			}
			
			[this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]]
			idx = parent
		}
	}

	down(idx) {
		while (true) {
			let largest = idx
			
			let left = 2 * idx
			let right = 2 * idx + 1
			
			if (right >= this.data.length) {
				return
			}

			if (right != this.data.length && this.cond(this.data[left], this.data[largest])) {
				largest = left
			}

			if (this.cond(this.data[right], this.data[largest])) {
				largest = right
			}
			
			if (largest == idx) {
				return
			}

			[this.data[largest], this.data[idx]] = [this.data[idx], this.data[largest]]
			idx = largest
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
	constructor(src, dest, weight = 1) {
		this.src = src
		this.dest = dest
		this.weight = weight
		
		this.deleted = false
	}
	
	delete() {
		this.src.removeCxn(this.dest)
	}
	
	mirror() {
		return this.dest.cxns.get(this.src)
	}
}

SearchData = class SearchData {
	constructor(id, dist = Infinity, last = undefined, custom = false) {
		this.id = id
		this.dist = dist
		this.last = last
		this.custom = custom
	}

	get(id, dist = Infinity, last = undefined, custom = false) {
		if (this.id != id) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
		}

		return this
	}

	update(id, dist = Infinity, last = undefined, custom = false) {
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
	static DEBUG = false

	constructor(val, name = "") {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.name = name
		this.cxns = new Map()
		this.searchData = new SearchData()
	}

	addCxn(node, weight = 1) {
		this.cxns.set(node, new Cxn(this, node, weight))
		return this
	}
	
	removeCxn(node) {
		if (this.cxns.has(node)) {
			this.cxns.get(node).deleted = true
			this.cxns.delete(node)
		}
		
		return this
	}
	
	getCxn(node) {
		return this.cxns.get(node)
	}
	
	getWeight(node) {
		return this.getCxn(node).weight
	}

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}
	
	exploreBfs(addCxns, visited = new Set()) {
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("exploreBfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.shift()
			let depth = cur.searchData.get(id).dist
			
			visited.add(cur)

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}
		
		if (Node.DEBUG) {
			console.timeEnd("exploreBfs")
		}
		
		return visited
	}
	
	exploreDijkstra(addCxns, visited = new Set(), heapCond = (p, c, pdist, cdist) => pdist <= cdist) {
		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (Node.DEBUG) {
			console.time("explore")
		}

		let i = 0
		
		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist
			
			visited.add(min)

			if (addCxns && min.cxns.size == 0) {
				addCxns(min)
			}

			for (let [dest, cxn] of min.cxns) {
				let seen = dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (dest.searchData.update(id, dist, min, true)) {
					if (seen) {
						heap.up(heap.data.indexOf(dest))
					} else {
						heap.insert(dest)
					}
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, heap.data.length, minDist)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("explore")
		}
		
		return visited
	}
	
	exploreDfs(addCxns, visited = new Set()) {
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("exploreDfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.pop()
			let depth = cur.searchData.get(id).dist
			
			visited.add(cur)

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("exploreDfs")
		}
		
		return visited
	}
	
	bfs(dest, addCxns, visited) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.bfs: Unrecognized destination type"
		}
		
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("bfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.shift()
			let depth = cur.searchData.get(id).dist
			
			visited?.add(cur)

			if (isDest(cur)) {
				if (Node.DEBUG) {
					console.log(i, queue.length)
					console.timeEnd("bfs")
				}

				return cur
			}

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("bfs")
			console.warn("Node.bfs: Could not find a path")
		}
	}

	dijkstra(dest, addCxns, visited, heapCond = (p, c, pdist, cdist) => pdist <= cdist) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.dijkstra: Unrecognized destination type"
		}

		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (Node.DEBUG) {
			console.time("dijkstra")
		}

		let i = 0
		
		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist
			
			visited?.add(min)

			if (isDest(min)) {
				if (Node.DEBUG) {
					console.log(i, heap.data.length, minDist)
					console.timeEnd("dijkstra")
				}

				return min
			}

			if (addCxns && min.cxns.size == 0) {
				addCxns(min)
			}

			for (let [dest, cxn] of min.cxns) {
				let seen = dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (dest.searchData.update(id, dist, min, true)) {
					if (seen) {
						heap.up(heap.data.indexOf(dest))
					} else {
						heap.insert(dest)
					}
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, heap.data.length, minDist)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("dijkstra")
			console.warn("Node.dijkstra: Could not find a path")
		}
	}
	
	dfs(dest, addCxns, visited) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.dfs: Unrecognized destination type"
		}
		
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("dfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.pop()
			let depth = cur.searchData.get(id).dist
			
			visited?.add(cur)

			if (isDest(cur)) {
				if (Node.DEBUG) {
					console.log(i, queue.length)
					console.timeEnd("dfs")
				}

				return cur
			}

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				let visited = dest.searchData.get(id, Infinity, undefined, false).custom
				if (!visited) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("dfs")
			console.warn("Node.dfs: Could not find a path")
		}
	}
	
	furthestBfs(addCxns) {
		let max = this
		
		for (let node of this.exploreBfs()) {
			if (max.searchData.dist < node.searchData.dist) {
				max = node
			}
		}
		
		return max
	}
	
	furthestDijkstra(addCxns) {
		let max = this
		
		for (let node of this.exploreDijkstra()) {
			if (max.searchData.dist < node.searchData.dist) {
				max = node
			}
		}
		
		return max
	}
	
	furthestsBfs(addCxns) {
		let max = [this]
		
		for (let node of this.exploreBfs()) {
			let maxDist = max[0].searchData.dist
			let dist = node.searchData.dist
			
			if (maxDist < dist) {
				max = [node]
			}
			
			if (maxDist == dist) {
				max.push(node)
			}
		}
		
		return max
	}
	
	furthestsDijkstra(addCxns) {
		let max = [this]
		
		for (let node of this.exploreDijkstra()) {
			let maxDist = max[0].searchData.dist
			let dist = node.searchData.dist
			
			if (maxDist < dist) {
				max = [node]
			}
			
			if (maxDist == dist) {
				max.push(node)
			}
		}
		
		return max
	}
}

Graph = class Graph extends Map {
	static fromStr(str, sep1 = " => ", sep2 = ", ", symmetric = false) {
		let graph = new Graph()
		
		for (let line of str.split("\n")) {
			let [src, dests] = line.split(sep1)
			
			for (let dest of dests.split(sep2)) {
				let srcNode = graph.getDef(src)
				let destNode = graph.getDef(dest)
				
				srcNode.addCxn(destNode)
				if (symmetric) {
					destNode.addCxn(srcNode)
				}
			}
		}
		
		return graph
	}
	
	constructor(nodes = []) {
		super()
		
		for (let node of nodes) {
			let key = node.name || node.val
			
			if (this.has(key)) {
				console.error(this.get(key))
				console.error(node)
				throw "Graph.Graph: two nodes with same value"
			}
			
			this.set(key, node)
		}
	}
	
	copy() {
		return new Graph(this)
	}
	
	delete(key) {
		let node = this.get(key)
		
		if (!node) {
			return false
		}
		
		for (let otherNode of this.values()) {
			otherNode.removeCxn(node)
		}
		
		return super.delete(key)
	}
	
	deleteNode(node) {
		return this.delete(node.name || node.val)
	}
	
	getDef(key) {
		if (!this.has(key)) {
			this.set(key, new Node(key, key))
		}
		
		return this.get(key)
	}
	
	getAssocMap() {
		let assocMap = new Map()
		
		for (let cxn of this.cxns()) {
			if (!assocMap.has(cxn.src)) {
				assocMap.set(cxn.src, new Set())
			}
			
			if (!assocMap.has(cxn.dest)) {
				assocMap.set(cxn.dest, new Set())
			}
			
			assocMap.get(cxn.src).add(cxn.dest)
			assocMap.get(cxn.dest).add(cxn.src)
		}
		
		return assocMap
	}
	
	numCxns() {
		let cxns = 0
		
		for (let node of this.values()) {
			cxns += node.cxns.size
		}
		
		return cxns
	}
	
	isConnected(key) {
		let start = key ? this.get(key) : this.values().next().value
		return this.size == start.exploreDfs().size
	}
	
	isSymmetric() {
		for (let cxn of this.cxns) {
			if (cxn.mirror?.weight != cxn.weight) {
				return false
			}
		}
		
		return true
	}
	
	resetSearch() {
		let id = Symbol()
		
		for (let node of this.values()) {
			node.searchData.update(id)
		}
		
		return this
	}
	
	componentsUndirected() {
		this.resetSearch()
		
		let res = []
		
		for (let node of this.values()) {
			if (!node.searchData.custom) {
				res.push(new Graph(node.exploreDfs()))
			}
		}
		
		return res
	}
	
	componentsDirected() {
		let components = this.componentsUndirected()
		
		for (let i = components.length - 1; i >= 0; i--) {
			for (let node of components[i].values()) {
				for (let j = i - 1; j >= 0; j--) {
					Map.prototype.delete.call(components[j], node.name || node.val)
				}
			}
		}
		
		return components.filter((e) => e.size)
	}
	
	minimumSpanningTree() {
		let id = Symbol()
		
		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return pdist <= cdist
		})
		
		for (let node of this.values()) {
			heap.insert(node)
		}
		
		let visited = new Set()
		
		while (heap.data.length) {
			let node = heap.extract()
			
			visited.add(node)
			
			for (let [dest, cxn] of node.cxns) {
				if (!visited.has(dest) && dest.searchData.update(id, cxn.weight, node, true)) {
					heap.up(heap.data.indexOf(dest))
				}
			}
		}
		
		return visited
	}
	
	*cxns() {
		for (let node of this.values()) {
			yield* node.cxns.values()
		}
	}
}

// ctor not overridden because it internally calls this.add
GenericSet = class GenericSet extends Set {
	encode(obj) {
		return obj
	}
	
	decode(key) {
		return key
	}
	
	has(obj) {
		return super.has(this.encode(obj))
	}

	add(obj) {
		return super.add(this.encode(obj))
	}

	delete(obj) {
		return super.delete(this.encode(obj))
	}

	forEach(callback, thisArg) {
		for (let key of this) {
			callback.call(thisArg, this.decode(key), this.decode(key), this)
		}
	}

	*[Symbol.iterator]() {
		for (let key of super[Symbol.iterator]()) {
			yield this.decode(key)
		}
	}

	*keys() {
		for (let key of super.keys()) {
			yield this.decode(key)
		}
	}

	*values() {
		for (let value of super.values()) {
			yield this.decode(value)
		}
	}

	*entries() {
		for (let [key, value] of super.entries()) {
			yield [this.decode(key), this.decode(value)]
		}
	}
}

GenericMap = class GenericMap extends Map {
	encode(obj) {
		return obj
	}
	
	decode(key) {
		return key
	}
	
	has(obj) {
		return super.has(this.encode(obj))
	}
	
	get(obj) {
		return super.get(this.encode(obj))
	}

	set(obj, val) {
		return super.set(this.encode(obj), val)
	}

	delete(obj) {
		return super.delete(this.encode(obj))
	}

	forEach(callback, thisArg) {
		for (let [key, value] of this) {
			callback.call(thisArg, value, this.decode(key), this)
		}
	}

	*[Symbol.iterator]() {
		for (let [key, value] of super[Symbol.iterator]()) {
			yield [this.decode(key), value]
		}
	}

	*keys() {
		for (let key of super.keys()) {
			yield this.decode(key)
		}
	}

	*entries() {
		for (let [key, value] of super.entries()) {
			yield [this.decode(key), value]
		}
	}
}

PointSet = class PointSet extends GenericSet {
	encode(pt) {
		return pt.toString()
	}

	decode(str) {
		return Point.fromString(str)
	}
}

NumericPointSet = class NumericPointSet extends GenericSet {
	encode(pt) {
		return Point.encode(pt)
	}

	decode(num) {
		return Point.decode(num)
	}
}

PointMap = class PointMap extends GenericMap {
	encode(pt) {
		return pt.toString()
	}

	decode(str) {
		return Point.fromString(str)
	}
}

NumericPointMap = class NumericPointMap extends GenericMap {
	encode(pt) {
		return Point.encode(pt)
	}

	decode(num) {
		return Point.decode(num)
	}
}

Instruction = class Instruction {
	constructor(command, types, args, varargs = false) {
		if (types.length != args.length && !varargs) {
			console.warn(`new Instruction: Attempted to create ${command} instruction: Expected ${types.length} arguments, got ${args.length} arguments`)
			console.log(args)
		}

		this.command = command
		this.args = args
		this.types = args.map((e, i) => types[i] ?? types[types.length - 1])
	}
}

// example command:
//
// add: {
//	 types: [ String, 0, 0 ],
//	 op: function(dest, a, b) {
//		 this.regs[dest] = a + b
//	 }
// }

VM = class VM {
	static evalNum(val) {
		return isNaN(val) ? this.regs[val] : Number(val)
	}

	get r() {
		return this.regs
	}

	constructor(init = () => {}, commands = {}) {
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
		this.halted = false
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

		return new Instruction(command, this.commands[command].types.map((e) => e.bind(this)) ?? [], words, this.commands[command].varargs)
	}

	executeInstruction(instr) {
		return this.commands[instr.command].op.apply(this, instr.args.map((e, i) => instr.types[i](e)))
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

	step() {
		let instr = this.program[this.regs.pc]

		if (!instr) {
			console.warn(`VM.run: No instruction found at PC ${this.regs.pc}; stopping`)
			this.halt()
			return
		}

		this.executeInstruction(instr)

		if (!this.commands[instr.command].holdPc) {
			this.regs.pc++
		}
	}

	run(limit = 100000) {
		while (!this.halted) {
			if (--limit <= 0) {
				console.error(`VM.run: Run limit reached; stopping`)
				this.halt()
				break
			}

			this.step()
		}
	}

	halt() {
		this.halted = true
	}
}

IntcodeParameter = class IntcodeParameter {
	static MODE_POS = 0
	static MODE_IMM = 1
	static MODE_REL = 2

	constructor(vm, val, mode) {
		this.vm = vm
		this.val = val
		this.mode = mode
	}

	get() {
		switch (this.mode) {
			case IntcodeParameter.MODE_POS:
				return this.vm.readMemory(this.val)
				break

			case IntcodeParameter.MODE_IMM:
				return this.val
				break

			case IntcodeParameter.MODE_REL:
				return this.vm.readMemory(this.vm.base + this.val)
				break

			default:
				console.error(`IntcodeParameter.get: Unrecognized parameter mode ${this.mode}`)
				this.vm.halt()
		}
	}

	set(val) {
		switch (this.mode) {
			case IntcodeParameter.MODE_POS:
				return this.vm.writeMemory(this.val, val)
				break

			case IntcodeParameter.MODE_IMM:
				console.error(`IntcodeParameter.set: Cannot write to parameter in immediate mode`)
				this.vm.halt()
				break

			case IntcodeParameter.MODE_REL:
				return this.vm.writeMemory(this.vm.base + this.val, val)
				break

			default:
				console.error(`IntcodeParameter.set: Unrecognized parameter mode ${this.mode}`)
				this.vm.halt()
		}
	}
}

IntcodeVM = class IntcodeVM {
	static OP_ADD = 1
	static OP_MUL = 2
	static OP_INP = 3
	static OP_OUT = 4
	static OP_JIT = 5
	static OP_JIF = 6
	static OP_SLT = 7
	static OP_SEQ = 8
	static OP_RBO = 9

	static OP_HLT = 99

	static INSTRS = []

	constructor(program, inputBuffer = [], outputBuffer = []) {
		this.program = program
		this.inputBuffer = inputBuffer
		this.outputBuffer = outputBuffer

		this.reset()
	}

	reset() {
		this.outputBuffer.length = 0

		this.data = this.program.slice()
		this.pc = 0
		this.base = 0

		this.running = false
		this.halted = false
		this.jumping = false
		this.awaitingInput = false
	}

	clone() {
		let vm = new IntcodeVM(this.program.slice(), this.inputBuffer.slice(), this.outputBuffer.slice())

		vm.data = this.data.slice()
		vm.pc = this.pc
		vm.base = this.base

		vm.running = this.running
		vm.halted = this.halted
		vm.jumping = this.jumping
		vm.awaitingInput = this.awaitingInput

		return vm
	}

	readMemory(addr) {
		if (addr < 0) {
			console.error(`IntcodeVM.readMemory: Attempted to read from invalid address ${addr}`)
			return null
		}

		return this.data[addr] ?? 0
	}

	writeMemory(addr, val) {
		if (addr < 0) {
			console.error(`IntcodeVM.writeMemory: Attempted to write ${val} to invalid address ${addr}`)
			return null
		}

		return this.data[addr] = val
	}

	executeInstruction(num) {
		let opcode = num % 100

		if (!(opcode in IntcodeVM.INSTRS)) {
			console.error(`IntcodeVM.executeInstruction: Unrecognized opcode: ${opcode} (${num})`)
		}

		let instr = IntcodeVM.INSTRS[opcode]

		let args = []
		let ptr = this.pc + 1

		num = Math.floor(num / 100)

		for (let i = 0; i < instr.arity; i++) {
			args.push(new IntcodeParameter(this, this.readMemory(ptr++), num % 10))
			num = Math.floor(num / 10)
		}

		instr.op.apply(this, args)

		return ptr
	}

	step() {
		let num = this.readMemory(this.pc)

		if (num === undefined) {
			console.error(`IntcodeVM.run: No instruction found at PC ${this.pc}; stopping`)
			this.halt()
			return
		}

		let newPc = this.executeInstruction(num)

		if (this.jumping) {
			this.jumping = false
		} else if (this.running) {
			this.pc = newPc
		}
	}

	run(limit = 10000000) {
		let i = 0

		this.running = true

		while (this.running) {
			if (++i > limit) {
				console.error(`IntcodeVM.run: Run limit reached; stopping`)
				this.halt()
				break
			}

			this.step()
		}

		return i
	}

	halt() {
		this.running = false
		this.halted = true
	}

	jump(newPc) {
		this.pc = newPc
		this.jumping = true
	}

	receiveInput() {
		if (this.inputBuffer.length) {
			return this.inputBuffer.shift()
		} else {
			this.awaitingInput = true
			this.running = false
			return null
		}
	}

	sendInput(...vals) {
		this.inputBuffer.push(...vals)
	}

	sendInputString(str) {
		this.sendInput(...str.split("").map((e) => e.charCodeAt()))
	}

	receiveOutput() {
		if (this.outputBuffer.length) {
			return this.outputBuffer.shift()
		} else {
			return null
		}
	}

	receiveNOutputs(n = Infinity) {
		let arr = []
		let res

		for (let i = 0; i < n; i++) {
			res = this.receiveOutput()

			if (res == null) {
				break
			}

			arr.push(res)
		}

		return arr
	}

	receiveOutputString(str) {
		return this.receiveNOutputs().map((e) => String.fromCharCode(e)).join("")
	}

	sendOutput(...vals) {
		this.outputBuffer.push(...vals)
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_ADD] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(a.get() + b.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_MUL] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(a.get() * b.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_INP] = {
	arity: 1,
	op: function(a) {
		let res = this.receiveInput()

		if (res !== null) {
			a.set(res)
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_OUT] = {
	arity: 1,
	op: function(a) {
		this.sendOutput(a.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_JIT] = {
	arity: 2,
	op: function(a, b) {
		if (a.get() != 0) {
			this.jump(b.get())
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_JIF] = {
	arity: 2,
	op: function(a, b) {
		if (a.get() == 0) {
			this.jump(b.get())
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_SLT] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(+(a.get() < b.get()))
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_SEQ] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(+(a.get() == b.get()))
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_RBO] = {
	arity: 1,
	op: function(a) {
		this.base += a.get()
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_HLT] = {
	arity: 0,
	op: function() {
		this.halt()
	}
}

EventHandler = class EventHandler {
	constructor(el) {
		for (let type of this.constructor.EVT_TYPES) {
			el.addEventListener(type, this)
		}
	}
	
	handleEvent(evt) {
		if (this.constructor.EVT_TYPES.includes(evt.type)) {
			this[evt.type](evt)
			evt.preventDefault()
		}
	}
}

Keyboard = class Keyboard extends EventHandler {
	static EVT_TYPES = [
		"keydown",
		"keyup"
	]
	
	constructor(el) {
		super(el)
		
		this.down = new Set()
		this.press = new Set()
	}
	
	resetFrame() {
		this.press.clear()
	}
	
	keydown(evt) {
		this.down.add(evt.key)
		this.press.add(evt.key)
	}
	
	keyup(evt) {
		this.down.delete(evt.key)
		this.press.delete(evt.key)
	}
}

Mouse = class Mouse extends EventHandler {
	static EVT_TYPES = [
		"mousemove",
		"mouseenter",
		"mouseleave",
		"mouseup",
		"mousedown"
	]

	constructor(el) {
		super(el)
		
		this.x = 0
		this.y = 0
		
		this.down = false
		this.press = false
		
		this.resetFrame()
	}
	
	resetFrame() {
		if (!this.down) {
			this.claimed = null
		}
		
		this.used = false
	}

	mousemove(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.press = false
	}

	mouseenter(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mouseleave(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mouseup(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mousedown(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = true
		this.press = true
	}
}

CanvasElement = class CanvasElement {
	static HIGHLIGHT_COLOR = "rgb(0, 0, 200)"
	static STROKE_COLOR = "rgb(0, 0, 0)"
	static TEXT_COLOR = "rgb(0, 0, 0)"
	static FILL_COLOR = "rgb(255, 255, 255)"
	static HOVER_COLOR = "rgb(235, 235, 235)"
	static PRESS_COLOR = "rgb(235, 235, 235)"

	static TEXT_SIZE = 18

	constructor() {
		this.pauseTimer = false
		this.timer = 0

		this.children = new Set()
		this.parent = null
		this.ctx = null
		
		this.totalChildren = 0
	}

	setCtx(ctx) {
		this.ctx = ctx
		this.reset()
		return this
	}
	
	remove() {
		this.parent?.removeElement(this)
	}

	addElement(el) {
		el.setCtx(this.ctx)
		this.children.add(el)
		el.parent = this
		return this
	}

	removeElement(el) {
		this.children.delete(el)
		el.parent = null
		return this
	}

	hasElement(el) {
		return this.children.has(el)
	}

	clearElements(el) {
		this.children.forEach((el) => el.parent = null)
		this.children.clear()
		return this
	}

	addTo(el) {
		el.addElement(this)
		return this
	}

	isIn(x, y) {
		return false
	}

	reset() {
		this.resetPre()

		this.hover = false
		this.press = false
		this.highlight = false

		for (let el of this.children) {
			el.setCtx(this.ctx)
		}

		this.resetPost()
	}

	resetPre() {}
	resetPost() {}

	update(keyboard, mouse) {
		this.totalChildren = 0
		
		this.keyboardUpdate(keyboard)
		
		if (mouse && (mouse.claimed == this || (!mouse.claimed && !mouse.used && this.isIn(mouse.x, mouse.y)))) {
			mouse.used = true
			
			this.hover = true

			this.mouseUpdate(mouse)

			if (mouse.press) {
				this.press = true
				this.mouseClick(mouse)
			} else if (!mouse.down && this.press) {
				this.press = false
				this.mouseRelease(mouse)
			}
		} else {
			this.hover = false
			this.press = false
			this.highlight = false
		}
		
		this.updatePre()

		for (let el of this.children) {
			el.update(keyboard, mouse)
			this.totalChildren += el.totalChildren + 1
		}

		this.updatePost()

		if (!this.pauseTimer) {
			this.timer++
		}
	}

	updatePre() {}
	updatePost() {}
	
	keyboardUpdate(keyboard) {}

	mouseUpdate(mouse) {}
	mouseClick(mouse) {}
	mouseRelease(mouse) {}

	draw() {
		this.drawPre()

		for (let el of this.children) {
			el.draw()
		}

		this.drawPost()
	}

	drawPre() {}
	drawPost() {}
	
	drawTop() {
		this.drawTopPre()

		for (let el of this.children) {
			el.drawTop()
		}

		this.drawTopPost()
	}
	
	drawTopPre() {}
	drawTopPost() {}

	getStrokeColor() {
		return this.highlight ? this.constructor.HIGHLIGHT_COLOR : this.constructor.STROKE_COLOR
	}

	getTextColor() {
		return this.highlight ? this.constructor.HIGHLIGHT_COLOR : this.constructor.TEXT_COLOR
	}

	getFillColor() {
		return this.press ? this.constructor.PRESS_COLOR :
			this.hover ? this.constructor.HOVER_COLOR : this.constructor.FILL_COLOR
	}

	getTextSize() {
		return this.constructor.TEXT_SIZE
	}
}

CanvasController = class CanvasController extends CanvasElement {
	static TARGET_FPS = 60

	constructor(width, height, updateCallback = () => {}) {
		super()

		this.width = width
		this.height = height
		this.updateCallback = updateCallback

		this.frameTimes = []

		this.targetFps = CanvasController.TARGET_FPS
		this.fps = this.targetFps
		this.fpsSlope = 0

		this.resetCanvas()
	}

	resetCanvas() {
		this.canvas = document.getElementById("canvas")

		if (this.canvas) {
			let newCanvas = this.canvas.cloneNode()
			this.canvas.replaceWith(newCanvas)
			this.canvas = newCanvas
		} else {
			this.canvas = document.createElement("canvas")
			this.canvas.id = "canvas"
			document.body.appendChild(this.canvas)
		}

		this.canvas.width = this.width
		this.canvas.height = this.height
		
		this.canvas.setAttribute("tabindex", 1)

		this.keyboard = new Keyboard(this.canvas)
		this.mouse = new Mouse(this.canvas)

		this.setCtx(this.canvas.getContext("2d"))
	}

	updatePre() {
		let oldTime = this.frameTimes[0]
		let time = performance.now()

		this.frameTimes.push(time)

		if (this.frameTimes.length > 30) {
			this.frameTimes.shift()
		}

		if (oldTime) {
			let average = 1000 * this.frameTimes.length / (time - oldTime)
			let change = this.fpsSlope + 0.1 * (average - (this.fps + this.fpsSlope))
			this.fps = Math.max(this.fps + change, 0)
			this.fpsSlope += 0.1 * (change - this.fpsSlope)
		}
		
		this.keyboard.resetFrame()
		this.mouse.resetFrame()
	}

	updatePost() {
		this.updateCallback.call(this)
		this.draw()
		this.drawTop()
	}

	drawPre() {
		this.ctx.fillStyle = "rgb(255, 255, 255)"
		this.ctx.fillRect(0, 0, this.width, this.height)

		this.ctx.strokeStyle = "rgb(0, 0, 0)"
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(0, 0, this.width, this.height)
	}

	drawPost() {
		this.ctx.fillStyle = "rgb(0, 0, 0)"
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.fps.toPrecision(5), 5, 18)
		this.ctx.fillText(this.totalChildren, 5, 36)
		
		this.ctx.textAlign = "right"
		this.ctx.fillText(this.mouse.x + ", " + this.mouse.y, 1195, 18)
	}

	tick() {
		this.update(this.keyboard, this.mouse)
	}
	
	loop(id) {
		if (window.currentControllerId == id) {
			this.tick()
			requestAnimationFrame(() => this.loop(id))
		}
	}
	
	start() {
		this.loop(window.currentControllerId = Math.random())
		return this
	}
}

Button = class Button extends CanvasElement {
	constructor(x, y, width, height, label, callback) {
		super()

		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.label = label
		this.callback = callback.bind(this)
	}

	isIn(x, y) {
		return x >= this.x && x <= this.x + this.width &&
			y >= this.y && y <= this.y + this.height
	}
	
	mouseClick(mouse) {
		mouse.claimed = this
	}

	mouseRelease(mouse) {
		this.callback()
	}

	drawTopPost() {
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.lineWidth = 1
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = "middle"
		this.ctx.font = `${this.getTextSize()}px monospace`

		this.ctx.fillStyle = this.getStrokeColor()
		this.ctx.beginPath()
		this.ctx.roundRect(this.x + 3, this.y + 3, this.width, this.height, 5)
		this.ctx.fill()
		this.ctx.stroke()

		let depression = this.getDepression()

		this.ctx.fillStyle = this.getFillColor()
		this.ctx.beginPath()
		this.ctx.roundRect(this.x + depression, this.y + depression, this.width, this.height, 5)
		this.ctx.fill()
		this.ctx.stroke()

		this.ctx.fillStyle = this.getTextColor()
		this.ctx.fillText(this.label, this.x + this.width / 2 + depression, this.y + this.height / 2 + depression)
	}
	
	// :(
	getDepression() {
		return this.press ? 2 : 0
	}
}

ToggleButton = class ToggleButton extends Button {
	static ACTIVE_COLOR = "rgb(215, 215, 255)"
	
	constructor(x, y, width, height, label, obj, prop, callback = () => {}) {
		super(x, y, width, height, label, function() {
			let orig = obj[prop]
			callback.call(this, orig)
			obj[prop] = !orig
		})
		
		this.obj = obj
		this.prop = prop
	}
	
	getFillColor() {
		return this.obj[this.prop] ? this.constructor.ACTIVE_COLOR : super.getFillColor()
	}
	
	getDepression() {
		return this.press ? 3 : this.obj[this.prop] ? 2 : 0
	}
}

GraphicalCxn = class GraphicalCxn extends CanvasElement {
	static HOVER_COLOR = "rgb(100, 0, 200)"
	
	static HITBOX_WIDTH = 5
	
	static ARROW_SIZE = 10
	static ARROW_ANGLE = Math.PI / 8

	static DUAL_CXN_SEP_ANGLE = 0.2
	static WEIGHT_SEP_ANGLE = 0.5
	
	constructor(graphGfx, cxn, size) {
		super()
		
		this.graphGfx = graphGfx
		this.cxn = cxn
		this.size = size
		
		this.angle = 0
		
		this.x1 = 0
		this.y1 = 0
		this.x2 = 0
		this.y2 = 0
		this.x3 = 0
		this.y3 = 0
		this.x4 = 0
		this.y4 = 0
		this.xm = 0
		this.ym = 0
		
		this.vx1 = 0
		this.vy1 = 0
		this.vx2 = 0
		this.vy2 = 0
		this.vx3 = 0
		this.vy3 = 0
		this.vx4 = 0
		this.vy4 = 0
		this.vxm = 0
		this.vym = 0
		
		this.vsize = 0
		this.varrowsize = 0
		this.vdist = 0
	}
	
	remove() {
		this.cxn.delete()
		super.remove()
	}
	
	isIn(x, y) {
		if (!this.graphGfx.config.showCxns || !this.graphGfx.config.tangibleCxns) {
			return false
		}
		
		x -= this.vx1
		y -= this.vy1
		
		let nx = x * Math.cos(-this.angle) - y * Math.sin(-this.angle)
		let ny = x * Math.sin(-this.angle) + y * Math.cos(-this.angle)
		
		return nx > -this.constructor.HITBOX_WIDTH && nx < this.constructor.HITBOX_WIDTH + this.vdist &&
			ny > -this.constructor.HITBOX_WIDTH && ny < this.constructor.HITBOX_WIDTH
	}
	
	mouseRelease(mouse) {
		if (this.graphGfx.pruning) {
			this.remove()
		}
	}
	
	updatePost() {
		if (this.cxn.deleted) {
			this.remove()
			return
		}
		
		if (!this.graphGfx.config.showCxns) {
			return
		}
		
		this.highlight = this.graphGfx.dijkstraCxns.has(this.cxn)
		
		let thisNode = this.cxn.src.gfx
		let thatNode = this.cxn.dest.gfx
		
		this.angle = Math.atan2(thatNode.y - thisNode.y, thatNode.x - thisNode.x)
		
		let shift = this.graphGfx.config.dualCxnSep && this.cxn.dest.cxns.has(this.cxn.src) ? this.constructor.DUAL_CXN_SEP_ANGLE : 0

		this.x1 = thisNode.x + thisNode.size * Math.cos(this.angle + shift)
		this.y1 = thisNode.y + thisNode.size * Math.sin(this.angle + shift)
		
		this.x2 = thatNode.x - thatNode.size * Math.cos(this.angle - shift)
		this.y2 = thatNode.y - thatNode.size * Math.sin(this.angle - shift)
		
		this.x3 = this.x2 - this.constructor.ARROW_SIZE * Math.cos(this.angle + this.constructor.ARROW_ANGLE)
		this.y3 = this.y2 - this.constructor.ARROW_SIZE * Math.sin(this.angle + this.constructor.ARROW_ANGLE)
		
		this.x4 = this.x2 - this.constructor.ARROW_SIZE * Math.cos(this.angle - this.constructor.ARROW_ANGLE)
		this.y4 = this.y2 - this.constructor.ARROW_SIZE * Math.sin(this.angle - this.constructor.ARROW_ANGLE)
		
		let push = (shift ? 1 : -1) * (shift + this.constructor.WEIGHT_SEP_ANGLE)

		this.xm = (
			thisNode.x + thisNode.size * Math.cos(this.angle + push) +
			thatNode.x - thatNode.size * Math.cos(this.angle - push)) / 2
		this.ym = (
			thisNode.y + thisNode.size * Math.sin(this.angle + push) +
			thatNode.y - thatNode.size * Math.sin(this.angle - push)) / 2
		
		this.vx1 = this.graphGfx.viewport.convertX(this.x1)
		this.vy1 = this.graphGfx.viewport.convertY(this.y1)
		this.vx2 = this.graphGfx.viewport.convertX(this.x2)
		this.vy2 = this.graphGfx.viewport.convertY(this.y2)
		this.vx3 = this.graphGfx.viewport.convertX(this.x3)
		this.vy3 = this.graphGfx.viewport.convertY(this.y3)
		this.vx4 = this.graphGfx.viewport.convertX(this.x4)
		this.vy4 = this.graphGfx.viewport.convertY(this.y4)
		this.vxm = this.graphGfx.viewport.convertX(this.xm)
		this.vym = this.graphGfx.viewport.convertY(this.ym)
		
		this.vsize = this.size * this.graphGfx.viewport.scale
		this.varrowsize = this.constructor.ARROW_SIZE * this.graphGfx.viewport.scale
		this.vdist = Math.hypot(this.vx2 - this.vx1, this.vy2 - this.vy1)
	}
	
	drawPost() {
		if (!this.graphGfx.config.showCxns) {
			return
		}
		
		this.ctx.strokeStyle = this.getColor()
		this.ctx.fillStyle = this.getColor()
		this.ctx.lineWidth = 1

		this.ctx.beginPath()
		this.ctx.moveTo(this.vx1, this.vy1)
		this.ctx.lineTo(this.vx2, this.vy2)
		this.ctx.stroke()

		if (this.varrowsize > 3) {
			this.ctx.beginPath()
			this.ctx.moveTo(this.vx2, this.vy2)
			this.ctx.lineTo(this.vx3, this.vy3)
			this.ctx.lineTo(this.vx4, this.vy4)
			this.ctx.closePath()
			this.ctx.fill()
		}

		if (this.graphGfx.config.showWeights && this.vsize > 7) {
			this.ctx.textAlign = "center"
			this.ctx.textBaseline = "middle"
			this.ctx.font = `${this.vsize}px monospace`
			this.ctx.fillText(this.cxn.weight, this.vxm, this.vym)
		}
	}
	
	getColor() {
		return this.hover ? this.constructor.HOVER_COLOR : this.getStrokeColor()
	}
}

GraphicalNode = class GraphicalNode extends CanvasElement {
	static FILL_COLOR = "rgba(0, 0, 0, 0)"
	static HOVER_COLOR = "rgba(0, 0, 0, 0.1)"
	static PRESS_COLOR = "rgba(0, 0, 0, 0.15)"

	constructor(graphGfx, node, x, y, size) {
		super()

		this.graphGfx = graphGfx
		this.node = node
		this.x = x
		this.y = y
		this.size = size
		
		this.vx = 0
		this.vy = 0
		this.vsize = 0
		
		this.fx = 0
		this.fy = 0

		this.dragX = 0
		this.dragY = 0
		this.dragMouseX = 0
		this.dragMouseY = 0
		
		for (let cxn of this.node.cxns.values()) {
			this.addElement(cxn.gfx = new GraphicalCxn(this.graphGfx, cxn, this.size))
		}
	}
	
	remove() {
		this.graphGfx.graph.deleteNode(this.node)
		
		for (let cxn of this.node.cxns.values()) {
			cxn.gfx.remove()
		}
		
		super.remove()
	}

	isIn(x, y) {
		return Math.hypot(this.vx - x, this.vy - y) <= this.vsize
	}

	mouseUpdate(mouse) {
		if (!this.graphGfx.pruning && this.press) {
			this.targetX = this.dragX + (mouse.x - this.dragMouseX) / this.graphGfx.viewport.scale
			this.targetY = this.dragY + (mouse.y - this.dragMouseY) / this.graphGfx.viewport.scale
		}
	}

	mouseClick(mouse) {
		if (!this.graphGfx.pruning) {
			mouse.claimed = this
			
			this.dragX = this.x
			this.dragY = this.y
			this.dragMouseX = mouse.x
			this.dragMouseY = mouse.y
		}
	}
	
	mouseRelease(mouse) {
		if (this.graphGfx.pruning) {
			if (this.isIn(mouse.x, mouse.y)) {
				this.remove()
			}
		} else {		
			if (this.graphGfx.seekingStart) {
				this.graphGfx.seekingStart = false
				this.graphGfx.dijkstraStart = this
			}
			
			if (this.graphGfx.seekingEnd) {
				this.graphGfx.seekingEnd = false
				this.graphGfx.dijkstraEnd = this
			}
		}
	}
	
	updatePre() {
		this.highlight =
			this == this.graphGfx.dijkstraStart ||
			this == this.graphGfx.dijkstraEnd ||
			this.graphGfx.dijkstraVisited.has(this.node)
		
		this.vx = this.graphGfx.viewport.convertX(this.x)
		this.vy = this.graphGfx.viewport.convertY(this.y)
		
		this.vsize = this.size * this.graphGfx.viewport.scale
	}

	drawPost() {
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.fillStyle = this.getFillColor()
		this.ctx.lineWidth = 1

		this.ctx.beginPath()
		this.ctx.arc(this.vx, this.vy, this.vsize, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.fill()

		if (this.vsize > 7) {
			this.ctx.fillStyle = this.getTextColor()
			this.ctx.textAlign = "center"
			this.ctx.textBaseline = "middle"
			this.ctx.font = `${this.vsize}px monospace`
			this.ctx.fillText(this.node.name, this.vx, this.vy)
		}
		
		if (!this.graphGfx.pruning && this.press) {
			this.x = this.targetX
			this.y = this.targetY
		} else {
			this.targetX = this.x
			this.targetY = this.y
		}
	}
}

GraphicalGraphViewport = class GraphicalGraphViewport {
	constructor(graphGfx) {
		this.graphGfx = graphGfx
		
		this.reset()
	}
	
	reset() {
		this.x = 0
		this.y = 0
		this.scale = 1
	}
	
	convertX(x) {
		return (x - this.x) * this.scale
	}
	
	revertX(x) {
		return x / this.scale + this.x
	}
	
	convertY(y) {
		return (y - this.y) * this.scale
	}
	
	revertY(y) {
		return y / this.scale + this.y
	}
	
	translate(x, y) {
		this.x = this.revertX(x)
		this.y = this.revertY(y)
	}
	
	zoom(scale) {
		let cx = this.graphGfx.ctx.canvas.width / 2
		let cy = this.graphGfx.ctx.canvas.height / 2
		
		this.translate(cx, cy)
		this.scale *= scale
		this.translate(-cx, -cy)
	}
}

GraphicalGraph = class GraphicalGraph extends CanvasElement {
	static BH_SPRING = 10
	static BH_LEN = 150
	static BH_THRESHOLD = 0.5
	
	config = {
		showCxns: true,
		showWeights: false,
		tangibleCxns: false,
		dualCxnSep: false
	}
	
	constructor(graph) {
		super()
		
		this.graph = graph
		this.assocMap = graph.getAssocMap()
		
		this.viewport = new GraphicalGraphViewport(this)
		
		this.seekingStart = false
		this.seekingEnd = false
		
		this.pruning = false
		
		this.forcing = false
		this.forcingTimer = 0
		
		this.resetDijkstra(true, true)
	}
	
	updatePost() {
		if (!this.children.has(this.dijkstraStart)) {
			this.dijkstraStart = null
		}
		
		if (!this.children.has(this.dijkstraEnd)) {
			this.dijkstraEnd = null
		}
		
		if (this.children.size == 0 && this.graph.size > 0) {
			for (let node of this.graph.values()) {
				node.gfx = new GraphicalNode(this, node, 0, 0, 20)
				this.addElement(node.gfx)
			}
			
			this.renderTree()
		}
		
		this.forcingUpdate()
	}

	drawPost() {
		this.ctx.fillStyle = GraphicalNode.HIGHLIGHT_COLOR
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.dijkstraLabel, 5, 54)
		
		this.ctx.fillStyle = "rgb(0, 0, 0)"
		this.ctx.textAlign = "right"
		this.ctx.fillText(Math.floor(this.viewport.revertX(this.parent.parent.mouse.x)) + ", " + Math.floor(this.viewport.revertY(this.parent.parent.mouse.y)), 1195, 36)
		this.ctx.fillText(this.viewport.scale.toFixed(2) + ", " + (1 / this.viewport.scale).toFixed(2), 1195, 54)
	}
	
	center() {
		let minx = Infinity
		let maxx = -Infinity
		let miny = Infinity
		let maxy = -Infinity
		
		for (let gfx of this.children) {
			minx = Math.min(minx, gfx.x)
			maxx = Math.max(maxx, gfx.x)
			miny = Math.min(miny, gfx.y)
			maxy = Math.max(maxy, gfx.y)
		}
		
		this.viewport.x = (minx + maxx) / 2
		this.viewport.y = (miny + maxy) / 2
		this.viewport.scale = Math.min(this.ctx.canvas.width / (maxx - minx), this.ctx.canvas.height / (maxy - miny))
		this.viewport.translate(-this.ctx.canvas.width / 2, -this.ctx.canvas.height / 2)
		this.viewport.zoom(0.8)
	}
	
	renderTree() {
		this.assocMap = this.graph.getAssocMap()
		
		let x = 0
		let y = 0
		
		for (let component of this.graph.componentsDirected()) {
			x = this.renderTreeComponent(component, x, y) + 100
		}
		
		this.center()
	}
	
	renderTreeComponent(component, x, y) {
		let head = component.values().next().value
		let layers = Array(head.furthestBfs().searchData.dist + 1).fill().map(() => [])
		
		for (let child of component.values()) {
			layers[child.searchData.dist].push(child)
		}
		
		let maxLen = Math.max.apply(null, layers.map((e) => e.length))
		let max = x
		
		for (let layer of layers) {
			for (let i = 0; i < layer.length; i++) {
				let newX = x - 100 * ((layer.length - maxLen) / 2 - i)
				max = Math.max(max, newX)
				layer[i].gfx.x = newX
				layer[i].gfx.y = y
			}
			
			y += 100
		}
		
		return max
	}
	
	renderForce() {
		this.assocMap = this.graph.getAssocMap()
		
		this.forcing = true
		this.forcingUpdate()
	}
	
	forcingUpdate() {
		if (!this.forcing || this.pruning) {
			this.forcing = false
			this.forcingTimer = 0
			return
		}
		
		let time = performance.now()
		
		let minx = Infinity
		let maxx = -Infinity
		let miny = Infinity
		let maxy = -Infinity
		
		for (let gfx of this.children) {
			minx = Math.min(minx, gfx.x)
			maxx = Math.max(maxx, gfx.x)
			miny = Math.min(miny, gfx.y)
			maxy = Math.max(maxy, gfx.y)
		}
		
		while (performance.now() < time + 1000 / 15) {
			let width = Math.max(maxx - minx, maxy - miny)
			let quadtree = this.populateQuadtree(this.children, minx, minx + width, miny, miny + width)
			
			for (let gfx1 of this.children) {
				gfx1.fx = 0
				gfx1.fy = 0
				
				this.applyRepulsion(gfx1, quadtree)
				
				for (let dest of this.assocMap.get(gfx1.node)) {
					let gfx2 = dest.gfx
					
					let dx = gfx2.x - gfx1.x
					let dy = gfx2.y - gfx1.y
					let sqdist = dx * dx + dy * dy
					
					let dist = Math.sqrt(sqdist)
					let max = dist
					
					let f = Math.min(
						this.constructor.BH_SPRING * Math.log(dist / this.constructor.BH_LEN) +
						this.constructor.BH_LEN * this.constructor.BH_LEN / sqdist, max)
					gfx1.fx += dx * f / dist
					gfx1.fy += dy * f / dist
				}
			}
			
			let cool = 1
			//let cool = 0.9999 ** this.forcingTimer
			let maxf = 0
			
			minx = Infinity
			maxx = -Infinity
			miny = Infinity
			maxy = -Infinity
			
			for (let gfx of this.children) {
				gfx.x += gfx.fx * cool
				gfx.y += gfx.fy * cool
				
				maxf = Math.max(maxf, gfx.fx * gfx.fx + gfx.fy * gfx.fy)
				
				minx = Math.min(minx, gfx.x)
				maxx = Math.max(maxx, gfx.x)
				miny = Math.min(miny, gfx.y)
				maxy = Math.max(maxy, gfx.y)
			}
			
			if (maxf < 0.1 / this.viewport.scale) {
				this.forcing = false
				break
			}
		}
			
		this.forcingTimer++
		this.center()
	}
	
	populateQuadtree(gfxNodes, minx, maxx, miny, maxy) {
		if (gfxNodes.size < 2) {
			let el = gfxNodes.values().next().value
			return {
				leaf: true,
				x: el?.x,
				y: el?.y,
				count: gfxNodes.size,
				node: el
			}
		}
		
		let subNodes = [new Set(), new Set(), new Set(), new Set()]
		
		let midx = (minx + maxx) / 2
		let midy = (miny + maxy) / 2
		
		let i = 0
		
		for (let gfx of gfxNodes) {
			if (maxx - minx < 1) {
				gfx.x += i * 5
				gfx.y += i * 5
				subNodes[i % 4].add(gfx)
			} else {
				subNodes[
					gfx.x <= midx && gfx.y <= midy ? 0 :
					gfx.x >= midx && gfx.y <= midy ? 1 :
					gfx.x <= midx && gfx.y >= midy ? 2 : 3].add(gfx)
			}
			
			i++
		}
		
		return {
			leaf: false,
			x: midx,
			y: midy,
			maxSqDist: (maxx - minx) * (maxx - minx) / this.constructor.BH_THRESHOLD,
			count: gfxNodes.size,
			nodes: [
				this.populateQuadtree(subNodes[0], minx, midx, miny, midy),
				this.populateQuadtree(subNodes[1], midx, maxx, miny, midy),
				this.populateQuadtree(subNodes[2], minx, midx, midy, maxy),
				this.populateQuadtree(subNodes[3], midx, maxx, midy, maxy)]
		}
	}
	
	applyRepulsion(gfx, tree) {
		if (tree.leaf && (tree.count == 0 || tree.node == gfx)) {
			return
		}
		
		let dx = tree.x - gfx.x
		let dy = tree.y - gfx.y
		let sqdist = dx * dx + dy * dy
		
		if (tree.leaf || sqdist > tree.maxSqDist) {
			let dist = Math.sqrt(sqdist)
			let max = dist
			
			let f = -tree.count * Math.min(this.constructor.BH_LEN * this.constructor.BH_LEN / sqdist, max)
			gfx.fx += dx * f / dist
			gfx.fy += dy * f / dist
		} else {
			this.applyRepulsion(gfx, tree.nodes[0])
			this.applyRepulsion(gfx, tree.nodes[1])
			this.applyRepulsion(gfx, tree.nodes[2])
			this.applyRepulsion(gfx, tree.nodes[3])
		}
	}
	
	renderBarycentric() {
		this.assocMap = this.graph.getAssocMap()
		
		let cycleEnd = null
		let cycleLen = 0
		
		let dists = new Map()
		let lasts = new Map()
		
		let node
		let i = Math.floor(Math.random() * this.graph.size)
		
		for (let cur of this.graph.values()) {
			if (i-- < 0) {
				break
			}
			
			node = cur
		}
		
		let id = Symbol()
		
		let queue = [node]
		let visited = new Set()
		
		node.searchData.id = id
		node.searchData.dist = 0
		node.searchData.last = undefined
		
		while (queue.length) {
			let cur = queue.pop()
			let dist = cur.searchData.dist
			let last = cur.searchData.last
			
			visited.add(cur)
			
			for (let dest of this.assocMap.get(cur)) {
				if (last != node && dest == node && cycleLen < dist + 1) {
					cycleEnd = cur
					cycleLen = dist + 1
				}
				
				if (!visited.has(dest)) {
					dest.searchData.id = id
					dest.searchData.dist = dist + 1
					dest.searchData.last = cur
					queue.push(dest)
				}
			}
		}
		
		cycleEnd ??= node.furthestBfs()
		
		let cycle = cycleEnd.unwrap()
		let r = 50 * cycle.length / Math.PI
		
		for (let i = 0; i < cycle.length; i++) {
			let k = i + Math.random() / 2
			cycle[i].gfx.x = r * Math.cos(2 * Math.PI * k / cycle.length)
			cycle[i].gfx.y = r * Math.sin(2 * Math.PI * k / cycle.length)
		}
		
		let cycleSet = new Set(cycle)
		let delta = Infinity
		
		while (delta > 3) {
			delta = 0
			
			for (let node of this.graph.values()) {
				let dests = this.assocMap.get(node)
				
				if (dests.size == 0 || cycleSet.has(node)) {
					continue
				}
				
				let sumX = 0
				let sumY = 0
				
				for (let dest of dests) {
					sumX += dest.gfx.x
					sumY += dest.gfx.y
				}
				
				node.gfx.fx = sumX / dests.size
				node.gfx.fy = sumY / dests.size
			}
			
			for (let node of this.graph.values()) {
				if (cycleSet.has(node)) {
					continue
				}
				
				delta = Math.max(delta, Math.hypot(node.gfx.fx - node.gfx.x, node.gfx.fy - node.gfx.y))
				
				node.gfx.x = node.gfx.fx
				node.gfx.y = node.gfx.fy
			}
		}
		
		this.center()
	}
	
	resetDijkstra(resetStart, resetEnd) {
		this.pruning = false
		
		if (resetStart) {
			this.dijkstraStart = null
		}
		
		if (resetEnd) {
			this.dijkstraEnd = null
		}
		
		this.dijkstraVisited = new Set()
		this.dijkstraCxns = new Set()
		this.dijkstraLabel = "-"
	}
	
	dijkstra() {
		if (!this.dijkstraStart) {
			return
		}
		
		this.pruning = false
		
		if (this.dijkstraEnd) {
			let res = this.dijkstraStart.node.dijkstra(this.dijkstraEnd.node)
			this.dijkstraLabel = res?.searchData.dist.toString() ?? "N/A"
			
			if (res) {
				this.dijkstraCxns.clear()
				
				for (let [src, dest] of res.unwrap().windowsGen(2)) {
					this.dijkstraVisited.add(dest)
					this.dijkstraCxns.add(src.getCxn(dest))
				}
			}
		} else {
			this.dijkstraStart.node.exploreDijkstra(undefined, this.dijkstraVisited)
			this.dijkstraLabel = this.dijkstraVisited.size
			this.dijkstraCxns.clear()
			
			for (let node of this.dijkstraVisited) {
				if (node.searchData.last) {
					this.dijkstraCxns.add(node.searchData.last.getCxn(node))
				}
			}
		}
	}
}

GraphicalGraphController = class GraphicalGraphController extends CanvasElement {
	static BUTTONS_START_X = 75
	static BUTTONS_START_Y = 10
	
	constructor(graph) {
		super()
		
		this.graphGfx = new GraphicalGraph(graph)
		
		this.buttonX = this.constructor.BUTTONS_START_X
		this.buttonY = this.constructor.BUTTONS_START_Y
		
		this
			.addToggleButton("dual sep", this.graphGfx.config, "dualCxnSep")
			.addToggleButton("cxns", this.graphGfx.config, "showCxns")
			.addToggleButton("weights", this.graphGfx.config, "showWeights")
			.addToggleButton("tangible cxns", this.graphGfx.config, "tangibleCxns")
			.addToggleButton("sel start", this.graphGfx, "seekingStart", () => this.graphGfx.resetDijkstra(true, false))
			.addToggleButton("sel end", this.graphGfx, "seekingEnd", () => this.graphGfx.resetDijkstra(false, true))
			.addButton("dijkstra", () => this.graphGfx.dijkstra())
			.addButton("reset dijkstra", () => this.graphGfx.resetDijkstra(true, true))
			.addToggleButton("pruning mode", this.graphGfx, "pruning", () => this.graphGfx.resetDijkstra(false, false))
			.addButton("focus", () => this.ctx.canvas.focus())
			.addButton("<", () => this.left(50))
			.addButton(">", () => this.right(50))
			.addButton("^", () => this.up(50))
			.addButton("v", () => this.down(50))
			.addButton("+", () => this.zoomIn(1.2))
			.addButton("-", () => this.zoomOut(1.2))
			.addButton("center", () => this.graphGfx.center())
			.addButton("tree", () => this.graphGfx.renderTree())
			.addToggleButton("force", this.graphGfx, "forcing", (forcing) => forcing && this.graphGfx.renderForce())
			.addButton("bary", () => this.graphGfx.renderBarycentric())
			.addElement(this.graphGfx)
	}
	
	keyboardUpdate(keyboard) {
		let shift = keyboard.down.has("Shift")
		
		if (keyboard.down.has("ArrowLeft")) {
			this.left(shift ? 10 : 50)
		} else if (keyboard.down.has("ArrowRight")) {
			this.right(shift ? 10 : 50)
		} else if (keyboard.down.has("ArrowUp")) {
			this.up(shift ? 10 : 50)
		} else if (keyboard.down.has("ArrowDown")) {
			this.down(shift ? 10 : 50)
		} else if (keyboard.down.has("=") || keyboard.down.has("+")) {
			this.zoomIn(shift ? 1.04 : 1.2)
		} else if (keyboard.down.has("-") || keyboard.down.has("_")) {
			this.zoomOut(shift ? 1.04 : 1.2)
		}
	}
	
	left(n) {
		return this.graphGfx.viewport.translate(-n, 0)
	}
	
	right(n) {
		return this.graphGfx.viewport.translate(n, 0)
	}
	
	up(n) {
		return this.graphGfx.viewport.translate(0, -n)
	}
	
	down(n) {
		return this.graphGfx.viewport.translate(0, n)
	}
	
	zoomIn(n) {
		return this.graphGfx.viewport.zoom(n)
	}
	
	zoomOut(n) {
		return this.graphGfx.viewport.zoom(1 / n)
	}
	
	addButton(label, callback) {
		let w = label.length
		
		this.addElement(new Button(this.buttonX, this.buttonY, 10 * w + 10, 25, label, callback))
		
		this.buttonX += 10 * w + 20
		
		if (this.buttonX > 1000) {
			this.buttonX = this.constructor.BUTTONS_START_X
			this.buttonY += 30
		}
		
		return this
	}
	
	addToggleButton(label, obj, prop, callback) {
		let w = label.length
		
		this.addElement(new ToggleButton(this.buttonX, this.buttonY, 10 * w + 10, 25, label, obj, prop, callback))
		
		this.buttonX += 10 * w + 20
		
		if (this.buttonX > 1000) {
			this.buttonX = this.constructor.BUTTONS_START_X
			this.buttonY += 30
		}
		
		return this
	}
}

utils = {
	log: (e, ...args) => (console.log(e instanceof Grid ? e.toString() : e, ...args), e),
	logCopy: (e, ...args) => (console.log(e instanceof Grid ? e.toString() : e.copyDeep(), ...args), e),
	condLog: (e, ...args) => globalThis.a.length == globalThis.inputLength ? e : utils.log(e, ...args),
	condLogCopy: (e, ...args) => globalThis.a.length == globalThis.inputLength ? e : utils.logCopy(e, ...args),
	fetchText: (...args) => fetch(...args).then((e) => e.text()),
	fetchEval: (...args) => utils.fetchText(...args).then((e) => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => {
		let func = functifyVal(fill)

		return Array(h).fill().map((_, y) => {
			return Array(w).fill().map((_, x) => func(new Point(x, y)))
		})
	},
	// num utils because numbers are weird
	divmod: (a, b) => {
		return [Math.floor(a / b), a % b]
	},
	powmod: (a, b, m) => {
		a %= m

		if (b == 0) {
			return 1
		}

		if (b == 1) {
			return a
		}

		let r = utils.powmod(a, Math.floor(b / 2), m)

		return (b % 2 ? a : 1) * r * r % m
	},
	gcd2: (a, b) => {
		while (b) {
			[a, b] = [b, a % b]
		}

		return a
	},
	gcd: (...args) => args.reduce(utils.gcd2, 0),
	lcm2: (a, b) => a && b ? a * (b / utils.gcd2(a, b)) : 0,
	lcm: (...args) => args.reduce(utils.lcm2, 1),
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

		let func = functifyVal(val)

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
	emptyArray: (n, func = (e, i) => i) => Array(n).fill().map(func),
	memoize: (func, serialize = (...args) => args.join("\0")) => {
		let map = new Map()

		return (...args) => {
			let key = serialize(...args)

			if (map.has(key)) {
				return map.get(key)
			}

			let val = func(...args)
			map.set(key, val)
			return val
		}
	},
	binarySearch: (func, start, end, searchVal = true) => {
		if (!(func(start) != searchVal && func(end) == searchVal)) {
			return null
		}

		let lastNo = start
		let lastYes = end

		while (lastYes - lastNo > 1) {
			let mid = Math.floor((lastNo + lastYes) / 2)

			if (func(mid) != searchVal) {
				lastNo = mid
			} else {
				lastYes = mid
			}
		}

		return lastYes
	},
	shoelaceArea: (arr) => {
		let area = 0
		
		for (let i = 0; i < arr.length; i++) {
			let a = arr[i]
			let b = arr[(i + 1) % arr.length]
			area += a.x * b.y - b.x * a.y
		}
		
		return area / 2
	},
	perimeter: (arr) => {
		let sum = 0
		
		for (let i = 0; i < arr.length; i++) {
			let a = arr[i]
			let b = arr[(i + 1) % arr.length]
			sum += a.dist(b)
		}
		
		return sum
	},
	manhattanPerimeter: (arr) => {
		let sum = 0
		
		for (let i = 0; i < arr.length; i++) {
			let a = arr[i]
			let b = arr[(i + 1) % arr.length]
			sum += a.manhattanDist(b)
		}
		
		return sum
	}
}

alpha = "abcdefghijklmnopqrstuvwxyz"
ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

utils.prime = utils.isPrime

M = utils.createMap

N = utils.emptyArray

O = utils.getObject

L = utils.log
LC = utils.logCopy
KL = utils.condLog
KLC = utils.condLogCopy

R = utils.range = utils.signAgnosticInclusiveRange

U = function U(n) {
	return utils.emptyArray(n, (e, i) => i + 1)
}

Z = function Z(n) {
	return utils.emptyArray(n, (e, i) => i)
}

for (let i of Object.getOwnPropertyNames(Math)) {
	if (Math[i] instanceof Function) {
		globalThis[i] = Math[i]
	}
}

defaultPartNum = 1

A = function A(ans, part = 0, k) {
	if (k) {
		throw "Third argument in submission function."
	}
	
	if (part < 1000 && typeof ans != "number") {
		console.warn("Tried to submit non-number; cancelled. To override, add 1000 to part number.")
		return
	}
	
	part %= 1000
	
	let day = +location.href.match(/(\d+)\/input/)[1]

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

			if (day == 25) {
				A(0, 2)
				setTimeout(() => A(0, 2), 1000)
			}
		}

		console.log(text.match(/<article([\s\S]+?)article>/)[0].replace(/<.+?>/g, "").replace(/rank \d+/g, "???").replace(/ and gained \d+ points!/g, "."))
	})

	return ans
}

B = function B(ans, part = 2) {
	return A(ans, part)
}

I = async function I(num) {
	let url = location.href.match(/^(.+)\/day/)[1] + "/day/" + num + "/input"
	history.pushState({}, "", url)

	let text = await utils.fetchText(url)
	a = (document.body.children[0] ?? document.body).innerText = text.trimEnd()
	defaultPartNum = 1
}

II = async function II(num) {
	if (window.aocTimeout) {
		clearTimeout(window.aocTimeout)
	}

	window.aocTimeout = setTimeout(() => I(num), new Date().setHours(21, 0, 2, 0) - new Date().getTime())
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
	}
	
	if (el instanceof Function) {
		return el
	}
	
	if (el instanceof Point) {
		return (e) => e.equals(el)
	}

	return (e) => e == el
}

function functifyVal(el) {
	if (el instanceof Function) {
		return el
	}

	return () => el
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
	Object.defineProperties(globalThis, {
		input: {
			get: function input() {
				let res = document.body.innerText.trimEnd()
				globalThis.inputLength = res.length
				return res
			},
			configurable: true
		}
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
		divmod: {
			value: function divmod(that) {
				return utils.divmod(+this, that)
			},
			configurable: true
		},
		powmod: {
			value: function powmod(that, mod) {
				return utils.powmod(+this, that, mod)
			},
			configurable: true
		},
		gcd: {
			value: function gcd(...args) {
				return utils.gcd(+this, ...args)
			},
			configurable: true
		},
		lcm: {
			value: function lcm(...args) {
				return utils.lcm(+this, ...args)
			},
			configurable: true
		},
		isPrime: {
			value: function isPrime() {
				return utils.isPrime(+this)
			},
			configurable: true
		},
		primeFactors: {
			value: function primeFactors() {
				return utils.primeFactors(+this)
			},
			configurable: true
		},
		factors: {
			value: function factors() {
				return utils.factors(+this)
			},
			configurable: true
		}
	})

	Object.defineProperties(String.prototype, {
		last: {
			get: function lastGet() {
				return this[this.length - 1]
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
		s: {
			value: function s(split = /\s+/g, limit) {
				return this.split(split, limit)
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
					if (func(this[i], i, this)) {
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
		},
		digits: {
			value: function digits() {
				return this.match(/\d/g)?.num() ?? []
			},
			configurable: true
		},
		reverse: {
			value: function reverse() {
				let s = ""
				
				for (let i = this.length - 1; i >= 0; i--) {
					s += this[i]
				}
				
				return s
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
		copy: {
			value: function copy() {
				return Object.assign({}, this)
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
		mapMut: {
			value: function mapMut(func) {
				for (let i = 0; i < this.length; i++) {
					this[i] = func(this[i], i, this)
				}

				return this
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
				n = Math.floor(n)

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
				return DLL.from(this)
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
					if (func(this[i], i, this)) {
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
					if (func(this[i], i, this)) {
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
			value: function sortNumAsc(func = (e) => e) {
				return this.sort((a, b) => func(a) - func(b))
			},
			configurable: true
		},
		sortNumDesc: {
			value: function sortNumAsc(func = (e) => e) {
				return this.sort((a, b) => func(b) - func(a))
			},
			configurable: true
		},
		insertSortedAsc: {
			value: function insertSortedAsc(val, func = (e) => e) {
				let key = func(val)
				
				for (let i = 0; i < this.length; i++) {
					if (func(this[i]) > key) {
						this.splice(i, 0, val)
						return this.length
					}
				}
				
				this.push(val)
				return this.length
			},
			configurable: true
		},
		insertSortedDesc: {
			value: function insertSortedDesc(val, func = (e) => e) {
				let key = func(val)
				
				for (let i = 0; i < this.length; i++) {
					if (func(this[i]) < key) {
						this.splice(i, 0, val)
						return this.length
					}
				}
				
				this.push(val)
				return this.length
			},
			configurable: true
		},
		sum: {
			value: function sum(func = (e) => +e) {
				let sum = 0
				
				for (let i = 0; i < this.length; i++) {
					sum += func(this[i], i, this)
				}
				
				return sum
			},
			configurable: true
		},
		mult: {
			value: function mult(val = 1) {
				return this.reduce((a, b) => a * b, val)
			},
			configurable: true
		},
		lcm: {
			value: function lcm() {
				return this.reduce(utils.lcm2, 1)
			},
			configurable: true
		},
		gcd: {
			value: function gcd() {
				return this.reduce(utils.gcd2, 0)
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
		pair: {
			value: function pair(that = this) {
				let len = Math.min(this.length, that.length)
				let res = new Array(len)
				
				for (let i = 0; i < len; i++) {
					res[i] = [this[i], that[i]]
				}
				
				return res
			},
			configurable: true
		},
		unorderedPairGen: {
			value: function* unorderedPairGen(that = this) {
				let len = Math.min(this.length, that.length)
				
				for (let i = 0; i < len - 1; i++) {
					for (let j = i + 1; j < len; j++) {
						yield [this[i], that[j]]
					}
				}
			},
			configurable: true
		},
		unorderedPair: {
			value: function unorderedPair(that) {
				return [...this.unorderedPairGen(that)]
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
		remove: {
			value: function remove(el) {
				let func = functify(el)
				
				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
						this.splice(i, 1)
						break
					}
				}
				
				return this
			},
			configurable: true
		},
		removeAll: {
			value: function removeAll(el) {
				let func = functify(el)
				
				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
						this.splice(i, 1)
						i--
					}
				}
				
				return this
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
		__min: {
			value: function __min(fn = (e) => e, tiebreak) {
				let minval = Infinity
				let min
				let idx

				for (let i = 0; i < this.length; i++) {
					let val = fn(this[i], i, this)

					if (minval > val ||
						(minval == val && tiebreak && tiebreak(min, this[i], idx, i) > 0)) {
						minval = val
						min = this[i]
						idx = i
					}
				}

				return { index: idx, element: min, value: minval }
			},
			configurable: true
		},
		minIndex: {
			value: function minIndex(fn, tiebreak) {
				return this.__min(fn, tiebreak).index
			},
			configurable: true
		},
		min: {
			value: function min(fn, tiebreak) {
				return this.__min(fn, tiebreak).element
			},
			configurable: true
		},
		minVal: {
			value: function minVal(fn, tiebreak) {
				return this.__min(fn, tiebreak).value
			},
			configurable: true
		},
		__max: {
			value: function __max(fn = (e) => e, tiebreak) {
				let maxval = -Infinity
				let max
				let idx

				for (let i = 0; i < this.length; i++) {
					let val = fn(this[i], i, this)

					if (maxval < val ||
						(maxval == val && tiebreak && tiebreak(max, this[i], idx, i) > 0)) {
						maxval = val
						max = this[i]
						idx = i
					}
				}

				return { index: idx, element: max, value: maxval }
			},
			configurable: true
		},
		maxIndex: {
			value: function maxIndex(fn, tiebreak) {
				return this.__max(fn, tiebreak).index
			},
			configurable: true
		},
		max: {
			value: function max(fn, tiebreak) {
				return this.__max(fn, tiebreak).element
			},
			configurable: true
		},
		maxVal: {
			value: function maxVal(fn, tiebreak) {
				return this.__max(fn, tiebreak).value
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
		freqsMap: {
			value: function freqsMap() {
				let res = new Map()
				
				for (let i = 0; i < this.length; i++) {
					let el = this[i]
					res.set(el, (res.get(el) ?? 0) + 1)
				}
				
				return res
			},
			configurable: true
		},
		freqsDict: {
			value: function freqsDict() {
				let res = {}
				
				for (let i = 0; i < this.length; i++) {
					let el = this[i]
					res[el] = (res[el] ?? 0) + 1
				}
				
				return res
			},
			configurable: true
		},
		freqs: {
			value: function freqs() {
				return [...this.freqsMap()]
			},
			configurable: true
		},
		sortFreqAsc: {
			value: function sortFreqAsc() {
				let freqs = this.freqsDict()
				return this.sort((a, b) => freqs[a] - freqs[b])
			},
			configurable: true
		},
		sortFreqDesc: {
			value: function sortFreqDesc() {
				let freqs = this.freqsDict()
				return this.sort((a, b) => freqs[b] - freqs[a])
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
		},
		deltas: {
			value: function deltas() {
				if (this.length < 2) {
					return []
				}
				
				let res = new Array(this.length - 1)
				let last = this[0]
				
				for (let i = 1; i < this.length; i++) {
					res[i - 1] = this[i] - last
					last = this[i]
				}
				
				return res
			},
			configurable: true
		},
		dict: {
			value: function dict(func, obj = {}) {
				for (let i = 0; i < this.length; i++) {
					func(obj, this[i], i, this)
				}
				
				return obj
			},
			configurable: true
		},
		windowsGen: {
			value: function* windowsGen(n, wrap = false) {
				if (this.length < n) {
					yield [...this]
				}
				
				let count = wrap ? this.length : this.length - n + 1
				
				for (let i = 0; i < count; i++) {
					let res = new Array(n)
					
					for (let j = 0; j < n; j++) {
						res[j] = this[(i + j) % this.length]
					}
					
					yield res
				}
			},
			configurable: true,
		},
		windows: {
			value: function windows(n, wrap) {
				return [...this.windowsGen(n, wrap)]
			},
			configurable: true
		},
		reverseRange: {
			value: function reverseRange(start, end) {
				let res = this.slice()
				
				for (let i = start; i < end; i++) {
					res[i] = this[start + end - i - 1]
				}
				
				return res
			},
			configurable: true
		},
		reverseRangeMut: {
			value: function reverseRangeMut(start, end) {
				for (let i = start, j = end - 1; i <= j; i++, j--) {
					[this[i], this[j]] = [this[j], this[i]]
				}
				
				return this
			},
			configurable: true
		},
		intersects: {
			value: function intersects(that) {
				let set = new Set(that)
				
				for (let el of this) {
					if (set.has(el)) {
						return true
					}
				}
				
				return false
			},
			configurable: true
		},
		shoelaceArea: {
			value: function shoelaceArea() {
				return utils.shoelaceArea(this)
			},
			configurable: true
		},
		perimeter: {
			value: function perimeter() {
				return utils.perimeter(this)
			},
			configurable: true
		},
		manhattanPerimeter: {
			value: function manhattanPerimeter() {
				return utils.manhattanPerimeter(this)
			},
			configurable: true
		},
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
				n = Math.floor(n)

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
				let func = functify(sep)

				let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (func(this[i], i, this)) {
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
				return this.mapArr((e) => that.map((f) => new PointArray(e, f))).flat()
			},
			configurable: true
		},
		pairsExcl: {
			value: function pairsExcl() {
				return this.mapArr((e, i) => this.filter((_, j) => i != j).map((f) => new PointArray(e, f))).flat()
			},
			configurable: true
		},
		pair: {
			value: function pair(that = this) {
				let len = Math.min(this.length, that.length)
				let res = new Array(len)
				
				for (let i = 0; i < len; i++) {
					res[i] = new PointArray(this[i], that[i])
				}
				
				return res
			},
			configurable: true
		},
		unorderedPairGen: {
			value: function* unorderedPairGen(that = this) {
				let len = Math.min(this.length, that.length)
				
				for (let i = 0; i < len - 1; i++) {
					for (let j = i + 1; j < len; j++) {
						yield new PointArray(this[i], that[j])
					}
				}
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
				return this.filter(e => !e.isIn(that))
			},
			configurable: true
		},
		int: {
			value: function int(that) {
				return this.filter(e => e.isIn(that))
			},
			configurable: true
		},
		windowsGen: {
			value: function* windowsGen(n, wrap = false) {
				if (this.length < n) {
					yield PointArray.from(this)
				}
				
				let count = wrap ? this.length : this.length - n + 1
				
				for (let i = 0; i < count; i++) {
					let res = new PointArray(n)
					
					for (let j = 0; j < n; j++) {
						res[j] = this[(i + j) % this.length]
					}
					
					yield res
				}
			},
			configurable: true,
		},
		intersects: {
			value: function intersects(that) {
				for (let i = 0; i < this.length; i++) {
					for (let j = 0; j < that.length; j++) {
						if (this[i].equals(that[j])) {
							return true
						}
					}
				}
				
				return false
			},
			configurable: true
		},
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
		intersects: {
			value: function intersects(that) {
				for (let val of this) {
					if (that.has(val)) {
						return true
					}
				}
				
				return false
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
	alias(Array.prototype, "v", "every")
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
	alias(Array.prototype, "flm", "flatMap")
	alias(Array.prototype, "fm", "flatMap")
	alias(Array.prototype, "for", "forEach")
	alias(Array.prototype, "h", "includes")
	alias(String.prototype, "h", "includes")
	alias(Set.prototype, "h", "has")
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
	alias(Array.prototype, "delete", "remove")
	alias(Array.prototype, "del", "remove")
	alias(Array.prototype, "deleteAll", "removeAll")
	alias(Array.prototype, "dela", "removeAll")
	alias(Array.prototype, "delv", "removeAll")
	alias(Array.prototype, "rep", "repeat")
	alias(String.prototype, "rep", "repeat")
	alias(String.prototype, "re", "replace")
	alias(String.prototype, "rea", "replaceAll")
	alias(String.prototype, "_", "reverse")
	alias(Array.prototype, "_", "reverse")
	alias(Array.prototype, "rl", "rotateLeft")
	alias(Array.prototype, "rr", "rotateRight")
	alias(Array.prototype, "S", "set")
	alias(Array.prototype, "sl", "slice")
	alias(String.prototype, "sl", "slice")
	alias(Array.prototype, "sorta", "sortNumAsc")
	alias(Array.prototype, "sna", "sortNumAsc")
	alias(Array.prototype, "sortd", "sortNumDesc")
	alias(Array.prototype, "snd", "sortNumDesc")
	alias(Array.prototype, "spl", "splice")
	alias(Array.prototype, "s", "split")
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

	alias(Grid.prototype, "p", "print")

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

	if (cb.every((e) => e.length == cb.length)) {
		g = Grid.fromStr(a)

		if (g.every((e) => !Number.isNaN(+e))) {
			g.numMut()
		}
	}
}

if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")
	const debug = process.argv.includes("debug")

	const test = function(name, answer, func, ...args) {
		let res = func(...args)
		console.log(`${name}: Got ${res}, expected ${answer}`)

		if (res != answer) {
			console.log(`${name}: FAIL`)
			return false
		}

		if (debug) {
			return true
		}

		let killTime = performance.now() + 30 * 1000
		let avgTime = 0
		let i

		for (i = -1; i < 100; i++) {
			let startTime = performance.now()
			let newRes = func(...args)
			let endTime = performance.now()

			if (newRes != res) {
				console.log(`${name}: FAIL`)
				return false
			}

			if (i >= 0) {
				avgTime = ((avgTime * i) + (endTime - startTime)) / (i + 1)
			}

			if (endTime > killTime) {
				i++
				break
			}
		}

		let colorCode = avgTime < 5 ? "32" : avgTime < 1000 ? "33" : "31"
		console.log(`${name}: \x1b[${colorCode}m${avgTime.toFixed(3)}ms\x1b[0m (avg over ${i} runs)`)

		return true
	}

	const year = "2023"

	for (let i = +process.argv[3] || 1; i <= 25; i++) {
		let jsPath = `./${year}/${i}.js`

		if (!fs.existsSync(jsPath)) {
			break
		}

		const func = require(jsPath)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8")
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").split("\n-----\n")

		if (i != 25) {
			if (!test(`${year} day ${i} part 1`, answers[0], func, input, false)) {
				break
			}

			if (!test(`${year} day ${i} part 2`, answers[1], func, input, true)) {
				break
			}
		} else {
			test(`${year} day ${i}`, answers[0], func, input)
		}
	}
}
if (typeof window == "undefined") {
	debugger
}
