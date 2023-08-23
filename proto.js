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
	Object.defineProperties(globalThis, {
		input: {
			get: function input() {
				return document.body.innerText.trimEnd()
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
		minVal: {
			value: function minVal(fn, tiebreak) {
				return fn(this.min(fn, tiebreak))
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
		maxVal: {
			value: function maxVal(fn, tiebreak) {
				return fn(this.max(fn, tiebreak))
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
	alias(Array.prototype, "sna", "sortNumAsc")
	alias(Array.prototype, "sortd", "sortNumDesc")
	alias(Array.prototype, "snd", "sortNumDesc")
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

