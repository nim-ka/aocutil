PtArray = PointArray = class PointArray extends Array {
	static convert(arr) {
		if (!(arr instanceof PointArray)) {
			arr.__proto__ = PointArray.prototype
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
		sum: {
			value: function(val = 0) {
				return this.reduce((a, b) => a + b, val)
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
				return Array(this[0].length).fill().map((_, i) => this.map(e => e[i]))
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
		rotate: {
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
		splitOnElement: {
			value: function(sep) {
				let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (this[i].equals(sep)) {
						arr.push([])
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
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
