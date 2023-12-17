Cxn = class Cxn {
	constructor(dest, weight = 1) {
		this.dest = dest
		this.weight = weight
	}
}

SearchData = class SearchData {
	constructor(id, dist = Infinity, last = undefined, custom = {}) {
		this.id = id
		this.dist = dist
		this.last = last
		this.custom = custom
	}

	get(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
		}

		return this
	}

	update(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id || this.dist > dist) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
			return true
		}

		return false
	}
}

Node = class Node {
	static GLOBAL_ID = 0
	static SUPPRESS_PRINTING = false

	constructor(val, name = "") {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.name = name
		this.cxns = []
		this.searchData = new SearchData()
	}

	addCxn(node, weight = 1) { this.cxns.push(new Cxn(node, weight)); return this }
	mapCxnsMut(func) { this.cxns = this.cxns.map(func); return this }
	filterCxnsMut(func) { this.cxns = this.cxns.filter(func); return this }
	getWeightTo(node) { return this.cxns.find((cxn) => cxn.dest == node)?.weight }

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}

	dijkstraTo(dest, addCxns, heapCond = (p, c, pdist, cdist) => pdist < cdist) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			console.error("Node.dijkstraTo: Unrecognized destination type")
		}

		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (!Node.SUPPRESS_PRINTING) {
			console.time("search")
		}

		let i = 0
		
		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist

			if (isDest(min)) {
				if (!Node.SUPPRESS_PRINTING) {
					console.log(i, heap.data.length, minDist)
					console.timeEnd("search")
				}

				min.searchData.get(id)
				return min
			}

			if (addCxns && min.cxns.length == 0) {
				addCxns(min)
			}

			min.cxns.forEach((cxn) => {
				let visited = cxn.dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (cxn.dest.searchData.update(id, dist, min, true)) {
					if (visited) {
						heap.up(heap.data.indexOf(cxn.dest))
					} else {
						heap.insert(cxn.dest)
					}
				}
			})

			if (!Node.SUPPRESS_PRINTING && ++i % 10000 == 0) {
				console.log(i, heap.data.length, minDist)
			}
		}

		if (!Node.SUPPRESS_PRINTING) {
			console.timeEnd("search")
			console.warn("Node.dijkstraTo: Could not find a path")
		}
	}

	createGfx(...args) {
		return this.gfx = new GraphicalNode(this, ...args)
	}
}

