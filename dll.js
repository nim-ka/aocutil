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


