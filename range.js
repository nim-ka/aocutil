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
	
	equals(that) {
		return this.x == that.x && this.l == that.l
	}
	
	has(num) {
		return this.x <= num && num < this.y
	}
	
	intersects(that) {
		return this.x < that.y && that.x < this.y
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
		
	}
	
	isSubset(that) {
		throw new Error(`lol fuck you`)
	}
	
	isSuperset(that) {
		throw new Error(`lol fuck you`)
	}
	
	reduce() {
		
	}
	
	addRangeMut(range) {
		for (let node of this.ranges.nodes()) {
			if (node.val.x < range.x) {
				this.ranges.insValBehindNode(node, range)
				return this
			}
		}
		
		this.ranges.insValEnd(range)
		return this
	}
	
	addRange(range) {
		let res = new RangeSet()
		let added = false
		
		for (let node of this.ranges.nodes()) {
			if (!added && node.val.x < range.x) {
				res.ranges.insValEnd(range)
				added = true
			}
			
			res.ranges.insValEnd(node.val)
		}
		
		if (!added) {
			res.ranges.insValEnd(range)
		}
		
		return res
	}
	
	add(that) {
		
	}
	
	subRangeMut(range) {
		
	}
	
	subRange(range) {
		
	}
	
	sub(that) {
		
	}
	
	*[Symbol.iterator]() {
		for (let range of this.ranges) {
			yield* range
		}
	}
}

