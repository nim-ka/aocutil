BinHeap = class BinHeap {
	constructor(cond = (p, c) => p < c) {
		this.cond = cond
		this.data = []
	}

	getTop() { return this.data[0] }
	getParent(idx) { return idx / 2 | 0 }
	getChildLeft(idx) { return 2 * idx }
	getChildRight(idx) { return 2 * idx + 1 }

	insert(val) {
		this.up(this.data.push(val) - 1)
	}

	extract() {
		let res = this.data[0]

		if (this.data.length > 1) {
			this.data[0] = this.data.pop()
			this.down(0)
		} else {
			this.data = []
		}

		return res
	}

	up(idx) {
		while (idx > 0) {
			let parent = idx / 2 | 0
			
			if (this.cond(this.data[parent], this.data[idx])) {
				break
			}
			
			[this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]]
			idx = parent
		}
	}

	down(idx) {
		let largest = idx
		let left = 2 * idx
		let right = 2 * idx + 1

		if (left < this.data.length && this.cond(this.data[left], this.data[largest])) {
			largest = left
		}

		if (right < this.data.length && this.cond(this.data[right], this.data[largest])) {
			largest = right
		}

		if (largest != idx) {
			[this.data[largest], this.data[idx]] = [this.data[idx], this.data[largest]]
			this.down(largest)
		}
	}

	indexOf(el) {
		return this.data.indexOf(el)
	}

	findIndex(func) {
		return this.data.findIndex(func)
	}

	extractIdx(idx) {
		let oldVal = this.data[idx]

		if (this.data.length > 1) {
			this.update(idx, this.data.pop())
		} else if (idx == 0) {
			this.data = []
		}

		return oldVal
	}

	update(idx, newVal) {
		let oldVal = this.data[idx]
		this.data[idx] = newVal

		if (this.cond(oldVal, newVal)) {
			this.down(idx)
		} else {
			this.up(idx)
		}

		return oldVal
	}
}

