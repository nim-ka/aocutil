Cxn = class Cxn {
	constructor(src, dest, weight = 1) {
		this.src = src
		this.dest = dest
		this.weight = weight
		
		this.deleted = false
	}
	
	delete() {
		this.src.removeCxn(this.dest)
	}
	
	mirror() {
		return this.dest.cxns.get(this.src)
	}
}

SearchData = class SearchData {
	constructor(id, dist = Infinity, last = undefined, custom = false) {
		this.id = id
		this.dist = dist
		this.last = last
		this.custom = custom
	}

	get(id, dist = Infinity, last = undefined, custom = false) {
		if (this.id != id) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
		}

		return this
	}

	update(id, dist = Infinity, last = undefined, custom = false) {
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
	static DEBUG = false

	constructor(val, name = "") {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.name = name
		this.cxns = new Map()
		this.searchData = new SearchData()
	}

	addCxn(node, weight = 1) {
		this.cxns.set(node, new Cxn(this, node, weight))
		return this
	}
	
	removeCxn(node) {
		if (this.cxns.has(node)) {
			this.cxns.get(node).deleted = true
			this.cxns.delete(node)
		}
		
		return this
	}
	
	getCxn(node) {
		return this.cxns.get(node)
	}
	
	getWeight(node) {
		return this.getCxn(node).weight
	}

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}
	
	exploreBfs(addCxns, visited = new Set()) {
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("exploreBfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.shift()
			let depth = cur.searchData.get(id).dist
			
			visited.add(cur)

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}
		
		if (Node.DEBUG) {
			console.timeEnd("exploreBfs")
		}
		
		return visited
	}
	
	exploreDijkstra(addCxns, visited = new Set(), heapCond = (p, c, pdist, cdist) => pdist <= cdist) {
		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (Node.DEBUG) {
			console.time("explore")
		}

		let i = 0
		
		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist
			
			visited.add(min)

			if (addCxns && min.cxns.size == 0) {
				addCxns(min)
			}

			for (let [dest, cxn] of min.cxns) {
				let seen = dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (dest.searchData.update(id, dist, min, true)) {
					if (seen) {
						heap.up(heap.data.indexOf(dest))
					} else {
						heap.insert(dest)
					}
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, heap.data.length, minDist)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("explore")
		}
		
		return visited
	}
	
	exploreDfs(addCxns, visited = new Set()) {
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("exploreDfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.pop()
			let depth = cur.searchData.get(id).dist
			
			visited.add(cur)

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("exploreDfs")
		}
		
		return visited
	}
	
	bfs(dest, addCxns, visited) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.bfs: Unrecognized destination type"
		}
		
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("bfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.shift()
			let depth = cur.searchData.get(id).dist
			
			visited?.add(cur)

			if (isDest(cur)) {
				if (Node.DEBUG) {
					console.log(i, queue.length)
					console.timeEnd("bfs")
				}

				return cur
			}

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				if (!dest.searchData.get(id, Infinity, undefined, false).custom) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("bfs")
			console.warn("Node.bfs: Could not find a path")
		}
	}

	dijkstra(dest, addCxns, visited, heapCond = (p, c, pdist, cdist) => pdist <= cdist) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.dijkstra: Unrecognized destination type"
		}

		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (Node.DEBUG) {
			console.time("dijkstra")
		}

		let i = 0
		
		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist
			
			visited?.add(min)

			if (isDest(min)) {
				if (Node.DEBUG) {
					console.log(i, heap.data.length, minDist)
					console.timeEnd("dijkstra")
				}

				return min
			}

			if (addCxns && min.cxns.size == 0) {
				addCxns(min)
			}

			for (let [dest, cxn] of min.cxns) {
				let seen = dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (dest.searchData.update(id, dist, min, true)) {
					if (seen) {
						heap.up(heap.data.indexOf(dest))
					} else {
						heap.insert(dest)
					}
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, heap.data.length, minDist)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("dijkstra")
			console.warn("Node.dijkstra: Could not find a path")
		}
	}
	
	dfs(dest, addCxns, visited) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			throw "Node.dfs: Unrecognized destination type"
		}
		
		let id = Symbol()
		
		let queue = [this]
		
		if (Node.DEBUG) {
			console.time("dfs")
		}
		
		let i = 0
		
		this.searchData.update(id, 0, undefined, true)
		
		while (queue.length) {
			let cur = queue.pop()
			let depth = cur.searchData.get(id).dist
			
			visited?.add(cur)

			if (isDest(cur)) {
				if (Node.DEBUG) {
					console.log(i, queue.length)
					console.timeEnd("dfs")
				}

				return cur
			}

			if (addCxns && cur.cxns.size == 0) {
				addCxns(cur)
			}

			for (let [dest] of cur.cxns) {
				let visited = dest.searchData.get(id, Infinity, undefined, false).custom
				if (!visited) {
					dest.searchData.update(id, depth + 1, cur, true)
					queue.push(dest)
				}
			}

			if (Node.DEBUG && ++i % 10000 == 0) {
				console.log(i, queue.length)
			}
		}

		if (Node.DEBUG) {
			console.timeEnd("dfs")
			console.warn("Node.dfs: Could not find a path")
		}
	}
	
	furthestBfs(addCxns) {
		let max = this
		
		for (let node of this.exploreBfs()) {
			if (max.searchData.dist < node.searchData.dist) {
				max = node
			}
		}
		
		return max
	}
	
	furthestDijkstra(addCxns) {
		let max = this
		
		for (let node of this.exploreDijkstra()) {
			if (max.searchData.dist < node.searchData.dist) {
				max = node
			}
		}
		
		return max
	}
	
	furthestsBfs(addCxns) {
		let max = [this]
		
		for (let node of this.exploreBfs()) {
			let maxDist = max[0].searchData.dist
			let dist = node.searchData.dist
			
			if (maxDist < dist) {
				max = [node]
			}
			
			if (maxDist == dist) {
				max.push(node)
			}
		}
		
		return max
	}
	
	furthestsDijkstra(addCxns) {
		let max = [this]
		
		for (let node of this.exploreDijkstra()) {
			let maxDist = max[0].searchData.dist
			let dist = node.searchData.dist
			
			if (maxDist < dist) {
				max = [node]
			}
			
			if (maxDist == dist) {
				max.push(node)
			}
		}
		
		return max
	}
}

Graph = class Graph extends Map {
	static fromStr(str, sep1 = " => ", sep2 = ", ", symmetric = false) {
		let graph = new Graph()
		
		for (let line of str.split("\n")) {
			let [src, dests] = line.split(sep1)
			
			for (let dest of dests.split(sep2)) {
				let srcNode = graph.getDef(src)
				let destNode = graph.getDef(dest)
				
				srcNode.addCxn(destNode)
				if (symmetric) {
					destNode.addCxn(srcNode)
				}
			}
		}
		
		return graph
	}
	
	constructor(nodes = []) {
		super()
		
		for (let node of nodes) {
			let key = node.name || node.val
			
			if (this.has(key)) {
				console.error(this.get(key))
				console.error(node)
				throw "Graph.Graph: two nodes with same value"
			}
			
			this.set(key, node)
		}
	}
	
	copy() {
		return new Graph(this)
	}
	
	delete(key) {
		let node = this.get(key)
		
		if (!node) {
			return false
		}
		
		for (let otherNode of this.values()) {
			otherNode.removeCxn(node)
		}
		
		return super.delete(key)
	}
	
	deleteNode(node) {
		return this.delete(node.name || node.val)
	}
	
	getDef(key) {
		if (!this.has(key)) {
			this.set(key, new Node(key, key))
		}
		
		return this.get(key)
	}
	
	getAssocMap() {
		let assocMap = new Map()
		
		for (let cxn of this.cxns()) {
			if (!assocMap.has(cxn.src)) {
				assocMap.set(cxn.src, new Set())
			}
			
			if (!assocMap.has(cxn.dest)) {
				assocMap.set(cxn.dest, new Set())
			}
			
			assocMap.get(cxn.src).add(cxn.dest)
			assocMap.get(cxn.dest).add(cxn.src)
		}
		
		return assocMap
	}
	
	numCxns() {
		let cxns = 0
		
		for (let node of this.values()) {
			cxns += node.cxns.size
		}
		
		return cxns
	}
	
	isConnected(key) {
		let start = key ? this.get(key) : this.values().next().value
		return this.size == start.exploreDfs().size
	}
	
	isSymmetric() {
		for (let cxn of this.cxns) {
			if (cxn.mirror?.weight != cxn.weight) {
				return false
			}
		}
		
		return true
	}
	
	resetSearch() {
		let id = Symbol()
		
		for (let node of this.values()) {
			node.searchData.update(id)
		}
		
		return this
	}
	
	componentsUndirected() {
		this.resetSearch()
		
		let res = []
		
		for (let node of this.values()) {
			if (!node.searchData.custom) {
				res.push(new Graph(node.exploreDfs()))
			}
		}
		
		return res
	}
	
	componentsDirected() {
		let components = this.componentsUndirected()
		
		for (let i = components.length - 1; i >= 0; i--) {
			for (let node of components[i].values()) {
				for (let j = i - 1; j >= 0; j--) {
					Map.prototype.delete.call(components[j], node.name || node.val)
				}
			}
		}
		
		return components.filter((e) => e.size)
	}
	
	minimumSpanningTree() {
		let id = Symbol()
		
		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return pdist <= cdist
		})
		
		for (let node of this.values()) {
			heap.insert(node)
		}
		
		let visited = new Set()
		
		while (heap.data.length) {
			let node = heap.extract()
			
			visited.add(node)
			
			for (let [dest, cxn] of node.cxns) {
				if (!visited.has(dest) && dest.searchData.update(id, cxn.weight, node, true)) {
					heap.up(heap.data.indexOf(dest))
				}
			}
		}
		
		return visited
	}
	
	*cxns() {
		for (let node of this.values()) {
			yield* node.cxns.values()
		}
	}
}

