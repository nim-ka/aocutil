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

load = function load() {
	Object.defineProperty(globalThis, "input", {
		get: function input() {
			return document.body.innerText.trim()
		},
		configurable: true
	})

	Object.defineProperties(Object.prototype, {
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
		set: {
			value: function set() {
				return new Set(this)
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
			value: function dll() {
				return new DLL(this)
			},
			configurable: true
		},
		truthy: {
			value: function truthy() {
				return this.filter((e) => e)
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
		splitOnElement: {
			value: function splitOnElement(sep) {
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
			value: function copy() {
				return this.slice()
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
		prod: {
			value: function prod(val = 1) {
				return this.reduce((a, b) => a * b, val)
			},
			configurable: true
		},
		mult: {
			value: function mult(...args) {
				return this.prod(...args)
			},
			configurable: true
		},
		cartProduct: {
			value: function cartProduct(that) {
				return this.flatMap((e) => that.map((f) => [e, f]))
			},
			configurable: true
		},
		pairs: {
			value: function pairs() {
				return this.cartProduct(this)
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
		findLast: {
			value: function findLast(func) {
				for (let i = this.length - 1; i >= 0; i--) {
					if (func(this[i], i, this)) {
						return this[i]
					}
				}
			},
			configurable: true
		},
		findLastIndex: {
			value: function findLastIndex(func) {
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
		pushUniq: {
			value: function pushUniq(...vals) {
				if (!warned) {
					console.warn("You should probably use a Set")
					warned = true
				}

				return this.push(...vals.uniq().sub(this))
			},
			configurable: true
		},
		count: {
			value: function count(fn) {
				return this.filter(typeof fn == "function" ? fn : (e) => e == fn).length
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
		}
	})

	Object.defineProperties(PointArray.prototype, {
		arr: {
			get: function() {
				return PointArray.revert(this)
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
		splitOnElement: {
			value: function splitOnElement(sep) {
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
			value: function cartProduct(that) {
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
		uniq: {
			value: function uniq() {
				return this.filter((e, i) => this.pt.indexOf(e) == i)
			},
			configurable: true
		},
		pushUniq: {
			value: function pushUniq(...vals) {
				return this.push(...vals.pt.uniq().pt.sub(this))
			},
			configurable: true
		},
		count: {
			value: function count(fn) {
				return this.filter(typeof fn == "function" ? fn : (e) => e.equals(fn)).length
			},
			configurable: true
		}
	})

	Object.defineProperties(Set.prototype, {
		length: {
			get: function() {
				return this.size
			},
			configurable: true
		},
		push: {
			value: function push(...vals) {
				for (let val of vals) {
					this.add(val)
				}

				return this
			},
			configurable: true
		},
		empty: {
			value: function empty() {
				return this.clear()
			},
			configurable: true
		},
		remove: {
			value: function remove(val) {
				return this.delete(val)
			},
			configurable: true
		},
		includes: {
			value: function includes(val) {
				return this.has(val)
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
}

load()
