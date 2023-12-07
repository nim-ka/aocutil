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
		let afirst = this.ranges.getNode(0)
		let bfirst = that.ranges.getNode(0)
		
		let anode = afirst
		let bnode = bfirst
		
		while (true) {
			while (anode.val.x < bnode.val.y) {
				if (anode.val.intersects(bnode.val)) {
					return true
				}
				
				if ((anode = anode.next) == afirst) {
					return false
				}
			}
			
			while (bnode.val.x < anode.val.y) {
				if (anode.val.intersects(bnode.val)) {
					return true
				}
				
				if ((bnode = bnode.next) == bfirst) {
					return false
				}
			}
		}
	}
	
	isSubset(that) {
		throw new Error(`lol fuck you`)
	}
	
	isSuperset(that) {
		throw new Error(`lol fuck you`)
	}
	
	fix() {
		let node = this.ranges.getNode(0)
		let len = this.ranges.length
		
		for (let i = 0; i < len - 1; i++) {
			let next = node.next
			
			let range = node.val
			let range2 = next.val
			
			if (range.l <= 0) {
				this.ranges.removeNode(node)
			} else if (range2.x <= range.y) {
				range2.x = range.x
				
				if (range2.y < range.y) {
					range2.y = range.y
				}
				
				this.ranges.removeNode(node)
			}
			
			node = next
		}
		
		return this
	}
	
	addRange(range) {
		for (let node of this.ranges.nodes()) {
			if (node.val.x > range.x) {
				this.ranges.insValBehindNode(node, range)
				return this.fix()
			}
		}
		
		this.ranges.insValEnd(range)
		return this.fix()
	}
	
	add(that) {
		for (let range of that.ranges) {
			this.addRange(range)
		}
		
		return this
	}
	
	subRange(range) {
		let node = this.ranges.getNode(0)
		let len = this.ranges.length
		
		for (let i = 0; i < len; i++) {
			if (range.has(node.val.x)) {
				node.val.x = range.y
			}
			
			if (range.has(node.val.y)) {
				node.val.y = range.x
			}
			
			if (node.val.y <= node.val.x) {
				this.ranges.removeNode(node)
			}
			
			node = node.next
		}
		
		return this
	}
	
	sub(that) {
		for (let range of that.ranges) {
			this.subRange(range)
		}
		
		return this
	}
	
	*[Symbol.iterator]() {
		for (let range of this.ranges) {
			yield* range
		}
	}
}

