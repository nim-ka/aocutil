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

