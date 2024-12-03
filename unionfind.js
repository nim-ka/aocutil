UnionFindNode = class UnionFindNode {
	constructor(val) {
		this.val = val
		this.parent = this
		this.numDescendants = 1
	}
}

UnionFind = class UnionFind {
	constructor(data = []) {
		this.nodes = new Map()
		this.numSets = 0
		
		for (let val of data) {
			this.add(val)
		}
	}
	
	has(val) {
		return this.nodes.has(val)
	}
	
	add(val) {
		if (this.nodes.has(val)) {
			throw "Tried to add duplicate element to UnionFind"
		}
		
		this.nodes.set(val, new UnionFindNode(val))
		
		return ++this.numSets
	}
	
	addAndConnectIf(val, func) {
		this.add(val)
		
		for (let val2 of this.nodes.keys()) {
			if (val != val2 && func(val, val2)) {
				this.connect(val, val2)
			}
		}
		
		return this.numSets
	}
	
	getRoot(val) {
		let node = this.nodes.get(val)
		if (!node) {
			return null
		}
		
		let root = node
		while (root.parent != root) {
			root = root.parent
		}
		
		while (node.parent != root) {
			[node, node.parent] = [node.parent, root]
		}
		
		return root
	}
	
	connect(val1, val2) {
		let root1 = this.getRoot(val1)
		let root2 = this.getRoot(val2)
		
		if (root1 != root2) {
			let [min, max] = root1.numDescendants < root2.numDescendants ? [root1, root2] : [root2, root1]
			min.parent = max
			max.numDescendants += min.numDescendants
			this.numSets--
		}
		
		return this.numSets
	}
}

