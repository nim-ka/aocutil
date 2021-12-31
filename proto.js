let warned = false

Object.defineProperty(Object.prototype, "copyDeep", {
	value: function() {
		return JSON.parse(JSON.stringify(this))
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
		value: function() {
			return this.reduce((a, b) => a + b)
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
			return this.filter((e, i) => this.lastIndexOf(e) == i)
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
			this.sort(func)
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
			return this.filter((e, i) => this.pt.lastIndexOf(e) == i)
		}
	},
	pushUniq: {
		value: function(...vals) {
			return this.push(...vals.pt.uniq().pt.sub(this))
		}
	}
})

