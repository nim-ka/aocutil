class BinHeap {
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
		while (this.getParent(idx) != idx && !this.cond(this.data[this.getParent(idx)], this.data[idx])) {
			let tmp = this.data[this.getParent(idx)]
			this.data[this.getParent(idx)] = this.data[idx]
			this.data[idx] = tmp
			idx = this.getParent(idx)
		}
	}

	down(idx) {
		let largest = idx
		let left = this.getChildLeft(idx)
		let right = this.getChildRight(idx)

		if (left < this.data.length && this.cond(this.data[left], this.data[largest])) {
			largest = left
		}

		if (right < this.data.length && this.cond(this.data[right], this.data[largest])) {
			largest = right
		}

		if (largest != idx) {
			let tmp = this.data[largest]
			this.data[largest] = this.data[idx]
			this.data[idx] = tmp

			this.down(largest)
		}
	}
}

window.BinHeap = BinHeap

