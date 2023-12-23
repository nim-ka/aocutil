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

