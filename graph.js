class Cxn {
	constructor(dest, weight = 1) {
		this.dest = dest
		this.weight = weight
	}
}

window.Cxn = Cxn

class SearchData {
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

		return { dist: this.dist, last: this.last, custom: this.custom }
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

window.SearchData = SearchData

class Node {
	static GLOBAL_ID = 0

	constructor(val) {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.cxns = []
		this.searchData = new SearchData(0)
	}

	addCxn(node, weight = 1) { this.cxns.push(new Cxn(node, weight)) }
	mapCxnsMut(func) { this.cxns = this.cxns.map(func) }
	filterCxnsMut(func) { this.cxns = this.cxns.filter(func) }
	getWeightTo(node) { return this.cxns.find((cxn) => cxn.dest == node)?.weight }

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}

	dijkstra(dests) {
		if (!Array.isArray(dests)) {
			dests = [dests]
		}

		let id = Symbol()

		this.searchData.update(id, 0)

		console.time("heap gen")

		let heap = new BinHeap((p, c) => p.searchData.get(id, Infinity, undefined, true).dist < c.searchData.get(id, Infinity, undefined, true).dist)
		let visited = {}
		let toVisit = [this]

		while (toVisit.length) {
			let toVisitNew = []

			toVisit.forEach((node) => {
				heap.insert(node)
				visited[node.id] = true
				node.cxns.map((cxn) => cxn.dest).map((node) => {
					if (!visited[node.id]) {
						toVisitNew.push(node)
						visited[node.id] = true
					}
				})
			})

			toVisit = toVisitNew
			console.log(toVisit.length)
		}

		console.timeEnd("heap gen")
		console.time("search")

		let i = 0

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id, Infinity, undefined, true).dist
			min.searchData.custom = false

			if (dests.includes(min)) {
				console.timeEnd("search")
				min.searchData.get(id)
				return min
			}

			min.cxns.filter((cxn) => cxn.dest.searchData.get(id).custom).forEach((cxn) => {
				if (cxn.dest.searchData.update(id, minDist + cxn.weight, min, true)) {
					let idx = heap.data.indexOf(cxn.dest)
					if (idx > -1) {
						heap.up(idx)
					}
				}
			})

			if (i++ % 1000 == 0) {
				console.log(heap.data.length)
			}
		}

		console.timeEnd("search")
		console.warn("Node.dijkstra: Could not find a path")
	}
}

window.Node = Node

