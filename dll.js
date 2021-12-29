// TODO:
// - copy method
// - remove range method

class DLLNode {
	constructor(val, skip = this, prev = this, next = this) {
		this.val = val
		this.skip = skip
		this.prev = prev
		this.next = next
	}

	adv(n) {
		let node = this == this.skip ? this.next : this

		if (n < 0) {
			while (n++) {
				node = node.prev
				if (node == this.skip) node = node.prev
			}
		} else {
			while (n--) {
				node = node.next
				if (node == this.skip) node = node.next
			}
		}

		return node
	}
}

class DLL {
	constructor(a = []) {
		this.h = new DLLNode()
		this.length = 0;

		a.forEach((e, i, a) => this.insEnd(e))
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

	insAheadNode(old, val) {
		let node = new DLLNode(val, this.h, old, old.next)
		old.next = node
		old.next.next.prev = node
		return ++this.length
	}

	insStart(val) { return this.insAheadNode(this.h, val) }
	unshift(val) { return this.insStart(val) }

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

	insBehindNode(old, val) {
		let node = new DLLNode(val, this.h, old.prev, old)
		old.prev = node
		old.prev.prev.next = node
		return ++this.length
	}

	insEnd(val) { return this.insBehindNode(this.h, val) }

	push(...vals) {
		let ret
		vals.forEach((val) => ret = this.insEnd(val))
		return ret
	}

	insNode(idx, node) { return this.insNodeBehindNode(this.getNode(idx), node) }
	insDLL(idx, dll) { return this.insDLLBehindNode(this.getNode(idx), dll) }
	ins(idx, val) { return this.insBehindNode(this.getNode(idx), val) }
	insNodeAhead(idx, node) { return this.insNodeAheadNode(this.getNode(idx), node) }
	insDLLAhead(idx, dll) { return this.insDLLAheadNode(this.getNode(idx), dll) }
	insAhead(idx, val) { return this.insAheadNode(this.getNode(idx), val) }

	removeNode(node) {
		let tmp = node.next
		node.prev.next = node.next
		tmp.prev = node.prev
		this.length--
		return node
	}

	remove(idx) { return this.removeNode(this.getNode(idx)).val }

	getNode(idx) { return this.h.adv(idx) }
	get(idx) { return this.getNode(idx).val }

	reverse() {
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

	rotate(rot) {
		let tmp = this.h.next
		this.removeNode(this.h)
		this.insBehindNodeNode(tmp.adv(-rot), this.h)
	}

	forEachNode(f) {
		let i = 0, node = this.h.next;

		while (node != this.h) {
			f(node, i++)
			node = node.next
		}

		return this
	}

	forEach(f) { return this.forEachNode((node, idx) => f(node.val, idx)) }
	mapMut(f) { return this.forEachNode((node, idx) => node.val = f(node.val, idx)) }

	includes(val) {
		let res = false
		this.forEach((e) => res |= e == val)
		return res
	}

	toArray() {
		let arr = new Array(this.length)

		this.forEach((el, idx) => arr[idx] = el)

		return arr
	}

	toJSON() { return this.toArray() }
	toString() { return this.toArray().toString() }
}

